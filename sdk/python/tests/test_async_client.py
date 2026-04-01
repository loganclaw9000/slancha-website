"""Tests for Slancha async client."""

import json

import httpx
import pytest
import respx

from slancha import AsyncSlancha
from slancha.exceptions import APIError, AuthenticationError, RateLimitError
from slancha.models import ChatCompletion, ChatCompletionChunk

from .conftest import CHAT_COMPLETION_RESPONSE, STREAM_CHUNKS, make_stream_lines

pytestmark = pytest.mark.asyncio


async def test_async_chat_completions(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    async with AsyncSlancha(api_key="sk-test") as client:
        resp = await client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}]
        )
    assert isinstance(resp, ChatCompletion)
    assert resp.choices[0].message.content == "Hello! How can I help?"
    assert resp.usage.total_tokens == 18


async def test_async_model_param(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    async with AsyncSlancha(api_key="sk-test") as client:
        await client.chat.completions.create(
            model="claude-3", messages=[{"role": "user", "content": "test"}]
        )
    body = json.loads(mock_api.calls[0].request.content)
    assert body["model"] == "claude-3"


async def test_async_auth_header(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    async with AsyncSlancha(api_key="sk-secret") as client:
        await client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}]
        )
    assert mock_api.calls[0].request.headers["authorization"] == "Bearer sk-secret"


async def test_async_401(mock_api):
    mock_api.post("/chat/completions").respond(401, text="Unauthorized")
    async with AsyncSlancha(api_key="sk-bad", max_retries=0) as client:
        with pytest.raises(AuthenticationError):
            await client.chat.completions.create(
                messages=[{"role": "user", "content": "hi"}]
            )


async def test_async_429(mock_api):
    mock_api.post("/chat/completions").respond(
        429, text="Rate limited", headers={"retry-after": "1"}
    )
    async with AsyncSlancha(api_key="sk-test", max_retries=0) as client:
        with pytest.raises(RateLimitError) as exc_info:
            await client.chat.completions.create(
                messages=[{"role": "user", "content": "hi"}]
            )
    assert exc_info.value.retry_after == 1.0


async def test_async_500(mock_api):
    mock_api.post("/chat/completions").respond(500, text="Internal error")
    async with AsyncSlancha(api_key="sk-test", max_retries=0) as client:
        with pytest.raises(APIError):
            await client.chat.completions.create(
                messages=[{"role": "user", "content": "hi"}]
            )


async def test_async_retry_then_success(mock_api):
    route = mock_api.post("/chat/completions")
    route.side_effect = [
        httpx.Response(503, text="Unavailable"),
        httpx.Response(200, json=CHAT_COMPLETION_RESPONSE),
    ]
    async with AsyncSlancha(api_key="sk-test", max_retries=2) as client:
        resp = await client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}]
        )
    assert isinstance(resp, ChatCompletion)
    assert len(mock_api.calls) == 2


async def test_async_retry_exhausted(mock_api):
    mock_api.post("/chat/completions").respond(502, text="Bad gateway")
    async with AsyncSlancha(api_key="sk-test", max_retries=1) as client:
        with pytest.raises(APIError):
            await client.chat.completions.create(
                messages=[{"role": "user", "content": "hi"}]
            )
    assert len(mock_api.calls) == 2


async def test_async_management_stubs():
    client = AsyncSlancha(api_key="sk-test")
    with pytest.raises(NotImplementedError, match="Management API"):
        client.providers.list()
    with pytest.raises(NotImplementedError):
        client.models.create()
    await client.close()
