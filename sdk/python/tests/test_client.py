"""Tests for Slancha sync client."""

import json

import httpx
import pytest
import respx

from slancha import Slancha
from slancha.exceptions import APIError, AuthenticationError, RateLimitError
from slancha.models import ChatCompletion, ChatCompletionChunk

from .conftest import CHAT_COMPLETION_RESPONSE, STREAM_CHUNKS, make_stream_lines


# ── Basic completions ───────────────────────────────────────────────


def test_chat_completions_create(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    client = Slancha(api_key="sk-test")
    resp = client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert isinstance(resp, ChatCompletion)
    assert resp.id == "chatcmpl-test123"
    assert resp.choices[0].message.content == "Hello! How can I help?"
    assert resp.usage.total_tokens == 18
    client.close()


def test_chat_completions_model_param(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    client = Slancha(api_key="sk-test")
    resp = client.chat.completions.create(
        model="gpt-4", messages=[{"role": "user", "content": "test"}]
    )
    assert isinstance(resp, ChatCompletion)
    req = mock_api.calls[0].request
    body = json.loads(req.content)
    assert body["model"] == "gpt-4"
    client.close()


def test_chat_completions_extra_kwargs(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    client = Slancha(api_key="sk-test")
    client.chat.completions.create(
        messages=[{"role": "user", "content": "test"}],
        temperature=0.7,
        max_tokens=100,
    )
    body = json.loads(mock_api.calls[0].request.content)
    assert body["temperature"] == 0.7
    assert body["max_tokens"] == 100
    client.close()


def test_auth_header_sent(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    client = Slancha(api_key="sk-mykey123")
    client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    req = mock_api.calls[0].request
    assert req.headers["authorization"] == "Bearer sk-mykey123"
    client.close()


def test_user_agent_header(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    client = Slancha(api_key="sk-test")
    client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    req = mock_api.calls[0].request
    assert "slancha-python" in req.headers["user-agent"]
    client.close()


# ── Streaming ───────────────────────────────────────────────────────


def test_streaming(mock_api):
    sse_text = make_stream_lines(STREAM_CHUNKS)
    mock_api.post("/chat/completions").respond(
        200,
        content=sse_text,
        headers={"content-type": "text/event-stream"},
    )
    client = Slancha(api_key="sk-test")
    chunks = list(
        client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}], stream=True
        )
    )
    assert len(chunks) == 4
    assert isinstance(chunks[0], ChatCompletionChunk)
    assert chunks[1].choices[0].delta.content == "Hi"
    assert chunks[2].choices[0].delta.content == " there"
    assert chunks[3].choices[0].finish_reason == "stop"
    client.close()


# ── Error handling ──────────────────────────────────────────────────


def test_401_raises_authentication_error(mock_api):
    mock_api.post("/chat/completions").respond(401, text="Invalid API key")
    client = Slancha(api_key="sk-bad", max_retries=0)
    with pytest.raises(AuthenticationError) as exc_info:
        client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert exc_info.value.status_code == 401
    client.close()


def test_429_raises_rate_limit_error(mock_api):
    mock_api.post("/chat/completions").respond(
        429, text="Rate limited", headers={"retry-after": "2.5"}
    )
    client = Slancha(api_key="sk-test", max_retries=0)
    with pytest.raises(RateLimitError) as exc_info:
        client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert exc_info.value.status_code == 429
    assert exc_info.value.retry_after == 2.5
    client.close()


def test_500_raises_api_error(mock_api):
    mock_api.post("/chat/completions").respond(500, text="Internal Server Error")
    client = Slancha(api_key="sk-test", max_retries=0)
    with pytest.raises(APIError) as exc_info:
        client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert exc_info.value.status_code == 500
    client.close()


def test_400_raises_api_error(mock_api):
    mock_api.post("/chat/completions").respond(400, text="Bad request")
    client = Slancha(api_key="sk-test", max_retries=0)
    with pytest.raises(APIError):
        client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    client.close()


# ── Retry logic ─────────────────────────────────────────────────────


def test_retry_on_429_then_success(mock_api):
    route = mock_api.post("/chat/completions")
    route.side_effect = [
        httpx.Response(429, text="Rate limited", headers={"retry-after": "0"}),
        httpx.Response(200, json=CHAT_COMPLETION_RESPONSE),
    ]
    client = Slancha(api_key="sk-test", max_retries=2)
    resp = client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert isinstance(resp, ChatCompletion)
    assert len(mock_api.calls) == 2
    client.close()


def test_retry_on_500_then_success(mock_api):
    route = mock_api.post("/chat/completions")
    route.side_effect = [
        httpx.Response(500, text="Server error"),
        httpx.Response(200, json=CHAT_COMPLETION_RESPONSE),
    ]
    client = Slancha(api_key="sk-test", max_retries=2)
    resp = client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert isinstance(resp, ChatCompletion)
    client.close()


def test_retry_exhausted_raises(mock_api):
    mock_api.post("/chat/completions").respond(503, text="Unavailable")
    client = Slancha(api_key="sk-test", max_retries=1)
    with pytest.raises(APIError):
        client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert len(mock_api.calls) == 2  # original + 1 retry
    client.close()


def test_no_retry_on_401(mock_api):
    """401 is not retryable — should fail immediately."""
    mock_api.post("/chat/completions").respond(401, text="Unauthorized")
    client = Slancha(api_key="sk-bad", max_retries=3)
    with pytest.raises(AuthenticationError):
        client.chat.completions.create(messages=[{"role": "user", "content": "hi"}])
    assert len(mock_api.calls) == 1
    client.close()


# ── Context manager ─────────────────────────────────────────────────


def test_context_manager(mock_api):
    mock_api.post("/chat/completions").respond(200, json=CHAT_COMPLETION_RESPONSE)
    with Slancha(api_key="sk-test") as client:
        resp = client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}]
        )
        assert isinstance(resp, ChatCompletion)


# ── Management stubs ────────────────────────────────────────────────


def test_providers_stub_raises():
    client = Slancha(api_key="sk-test")
    with pytest.raises(NotImplementedError, match="Management API coming soon"):
        client.providers.list()
    client.close()


def test_models_stub_raises():
    client = Slancha(api_key="sk-test")
    with pytest.raises(NotImplementedError, match="Management API coming soon"):
        client.models.list()
    client.close()


def test_routing_stub_raises():
    client = Slancha(api_key="sk-test")
    with pytest.raises(NotImplementedError, match="Management API coming soon"):
        client.routing.list()
    client.close()


def test_config_stub_raises():
    client = Slancha(api_key="sk-test")
    with pytest.raises(NotImplementedError, match="dashboard"):
        client.config.generate_yaml()
    client.close()


# ── Custom base_url ─────────────────────────────────────────────────


def test_custom_base_url():
    with respx.mock(base_url="http://localhost:8080/v1") as local_mock:
        local_mock.post("/chat/completions").respond(
            200, json=CHAT_COMPLETION_RESPONSE
        )
        client = Slancha(api_key="sk-test", base_url="http://localhost:8080/v1")
        resp = client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}]
        )
        assert isinstance(resp, ChatCompletion)
        client.close()
