"""Slancha sync client — OpenAI-compatible inference via httpx."""

from __future__ import annotations

from typing import Any, Iterator

import httpx

from slancha._retry import sync_retry
from slancha.exceptions import APIError, AuthenticationError, RateLimitError, TimeoutError
from slancha.models import ChatCompletion, ChatCompletionChunk

_DEFAULT_BASE_URL = "https://api.slancha.ai/v1"
_CONNECT_TIMEOUT = 30.0
_READ_TIMEOUT = 120.0


def _raise_for_status(resp: httpx.Response) -> None:
    if resp.status_code == 401:
        raise AuthenticationError(resp.text, status_code=401)
    if resp.status_code == 429:
        ra = resp.headers.get("retry-after")
        raise RateLimitError(
            resp.text,
            retry_after=float(ra) if ra else None,
            status_code=429,
        )
    if resp.status_code >= 500:
        raise APIError(resp.text, status_code=resp.status_code)
    if resp.status_code >= 400:
        raise APIError(resp.text, status_code=resp.status_code)


class _Completions:
    """chat.completions namespace."""

    def __init__(self, client: Slancha) -> None:
        self._client = client

    def create(
        self,
        *,
        model: str = "auto",
        messages: list[dict[str, Any]],
        stream: bool = False,
        **kwargs: Any,
    ) -> ChatCompletion | Iterator[ChatCompletionChunk]:
        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": stream,
            **kwargs,
        }
        if stream:
            return self._stream(payload)
        return self._create(payload)

    def _create(self, payload: dict[str, Any]) -> ChatCompletion:
        resp = sync_retry(
            lambda: self._client._http.post(
                "/chat/completions",
                json=payload,
            ),
            max_retries=self._client._max_retries,
        )
        _raise_for_status(resp)
        return ChatCompletion.model_validate(resp.json())

    def _stream(self, payload: dict[str, Any]) -> Iterator[ChatCompletionChunk]:
        with self._client._http.stream(
            "POST", "/chat/completions", json=payload
        ) as resp:
            _raise_for_status(resp)
            for line in resp.iter_lines():
                if not line or not line.startswith("data: "):
                    continue
                data = line[len("data: "):]
                if data.strip() == "[DONE]":
                    break
                import json

                chunk = ChatCompletionChunk.model_validate(json.loads(data))
                yield chunk


class _Chat:
    """chat namespace."""

    def __init__(self, client: Slancha) -> None:
        self.completions = _Completions(client)


class _ManagementStub:
    """Placeholder for management APIs (providers, models, routing, config)."""

    _MSG = "Management API coming soon — use the dashboard at slancha.ai/dashboard"

    def __getattr__(self, name: str) -> Any:
        def _stub(*args: Any, **kwargs: Any) -> None:
            raise NotImplementedError(self._MSG)
        return _stub


class Slancha:
    """Synchronous Slancha client.

    Usage::

        from slancha import Slancha
        client = Slancha(api_key="sk-...")
        resp = client.chat.completions.create(
            messages=[{"role": "user", "content": "Hello!"}],
        )
        print(resp.choices[0].message.content)
    """

    def __init__(
        self,
        *,
        api_key: str,
        base_url: str = _DEFAULT_BASE_URL,
        max_retries: int = 3,
        timeout_connect: float = _CONNECT_TIMEOUT,
        timeout_read: float = _READ_TIMEOUT,
    ) -> None:
        self._max_retries = max_retries
        self._http = httpx.Client(
            base_url=base_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "slancha-python/0.1.0",
            },
            timeout=httpx.Timeout(timeout_connect, read=timeout_read),
        )
        self.chat = _Chat(self)
        self.providers = _ManagementStub()
        self.models = _ManagementStub()
        self.routing = _ManagementStub()
        self.config = _ManagementStub()

    def close(self) -> None:
        self._http.close()

    def __enter__(self) -> Slancha:
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()
