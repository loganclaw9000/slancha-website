"""Shared fixtures for Slancha SDK tests."""

import json

import pytest
import respx

CHAT_COMPLETION_RESPONSE = {
    "id": "chatcmpl-test123",
    "object": "chat.completion",
    "created": 1700000000,
    "model": "auto",
    "choices": [
        {
            "index": 0,
            "message": {"role": "assistant", "content": "Hello! How can I help?"},
            "finish_reason": "stop",
        }
    ],
    "usage": {"prompt_tokens": 10, "completion_tokens": 8, "total_tokens": 18},
    "system_fingerprint": "fp_test",
}


def make_stream_lines(chunks: list[dict]) -> str:
    """Build SSE text from a list of chunk dicts."""
    lines = []
    for c in chunks:
        lines.append(f"data: {json.dumps(c)}\n\n")
    lines.append("data: [DONE]\n\n")
    return "".join(lines)


STREAM_CHUNKS = [
    {
        "id": "chatcmpl-stream1",
        "object": "chat.completion.chunk",
        "created": 1700000000,
        "model": "auto",
        "choices": [{"index": 0, "delta": {"role": "assistant"}, "finish_reason": None}],
    },
    {
        "id": "chatcmpl-stream1",
        "object": "chat.completion.chunk",
        "created": 1700000000,
        "model": "auto",
        "choices": [{"index": 0, "delta": {"content": "Hi"}, "finish_reason": None}],
    },
    {
        "id": "chatcmpl-stream1",
        "object": "chat.completion.chunk",
        "created": 1700000000,
        "model": "auto",
        "choices": [{"index": 0, "delta": {"content": " there"}, "finish_reason": None}],
    },
    {
        "id": "chatcmpl-stream1",
        "object": "chat.completion.chunk",
        "created": 1700000000,
        "model": "auto",
        "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
    },
]


@pytest.fixture()
def base_url():
    return "https://api.slancha.ai/v1"


@pytest.fixture()
def mock_api(base_url):
    with respx.mock(base_url=base_url) as router:
        yield router
