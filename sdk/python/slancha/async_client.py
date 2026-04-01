"""Slancha async client — OpenAI-compatible inference via httpx.AsyncClient."""

from __future__ import annotations

from typing import Any, AsyncIterator

import httpx

from slancha._retry import async_retry
from slancha.exceptions import APIError, AuthenticationError, RateLimitError
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


class _AsyncCompletions:
    """chat.completions namespace (async)."""

    def __init__(self, client: AsyncSlancha) -> None:
        self._client = client

    async def create(
        self,
        *,
        model: str = "auto",
        messages: list[dict[str, Any]],
        stream: bool = False,
        **kwargs: Any,
    ) -> ChatCompletion | AsyncIterator[ChatCompletionChunk]:
        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": stream,
            **kwargs,
        }
        if stream:
            return self._stream(payload)
        return await self._create(payload)

    async def _create(self, payload: dict[str, Any]) -> ChatCompletion:
        resp = await async_retry(
            lambda: self._client._http.post(
                "/chat/completions",
                json=payload,
            ),
            max_retries=self._client._max_retries,
        )
        _raise_for_status(resp)
        return ChatCompletion.model_validate(resp.json())

    async def _stream(
        self, payload: dict[str, Any]
    ) -> AsyncIterator[ChatCompletionChunk]:
        import json

        async with self._client._http.stream(
            "POST", "/chat/completions", json=payload
        ) as resp:
            _raise_for_status(resp)
            async for line in resp.aiter_lines():
                if not line or not line.startswith("data: "):
                    continue
                data = line[len("data: "):]
                if data.strip() == "[DONE]":
                    break
                chunk = ChatCompletionChunk.model_validate(json.loads(data))
                yield chunk


class _AsyncChat:
    """chat namespace (async)."""

    def __init__(self, client: AsyncSlancha) -> None:
        self.completions = _AsyncCompletions(client)


class _ManagementStub:
    """Placeholder for management APIs."""

    _MSG = "Management API coming soon — use the dashboard at slancha.ai/dashboard"

    def __getattr__(self, name: str) -> Any:
        def _stub(*args: Any, **kwargs: Any) -> None:
            raise NotImplementedError(self._MSG)
        return _stub


class AsyncSlancha:
    """Asynchronous Slancha client.

    Usage::

        import asyncio
        from slancha import AsyncSlancha

        async def main():
            client = AsyncSlancha(api_key="sk-...")
            resp = await client.chat.completions.create(
                messages=[{"role": "user", "content": "Hello!"}],
            )
            print(resp.choices[0].message.content)
            await client.close()

        asyncio.run(main())
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
        self._http = httpx.AsyncClient(
            base_url=base_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "slancha-python/0.1.0",
            },
            timeout=httpx.Timeout(timeout_connect, read=timeout_read),
        )
        self.chat = _AsyncChat(self)
        self.providers = _ManagementStub()
        self.models = _ManagementStub()
        self.routing = _ManagementStub()
        self.config = _ManagementStub()

    async def close(self) -> None:
        await self._http.aclose()

    async def __aenter__(self) -> AsyncSlancha:
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.close()
