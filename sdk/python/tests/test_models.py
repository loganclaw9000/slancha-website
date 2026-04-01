"""Tests for Pydantic model parsing."""

import pytest

from slancha.models import (
    ChatCompletion,
    ChatCompletionChunk,
    ChoiceDelta,
    Deployment,
    EvalResult,
    EvalRun,
    FineTuneJob,
    Message,
    Provider,
    RouterModel,
    RoutingDecision,
    StreamChoice,
    Usage,
)


def test_chat_completion_parse():
    data = {
        "id": "cmpl-1",
        "object": "chat.completion",
        "created": 1700000000,
        "model": "auto",
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": "hi"},
                "finish_reason": "stop",
            }
        ],
        "usage": {"prompt_tokens": 5, "completion_tokens": 1, "total_tokens": 6},
    }
    obj = ChatCompletion.model_validate(data)
    assert obj.id == "cmpl-1"
    assert obj.choices[0].message.role == "assistant"
    assert obj.usage.total_tokens == 6


def test_chat_completion_chunk_parse():
    data = {
        "id": "chunk-1",
        "object": "chat.completion.chunk",
        "created": 1700000000,
        "model": "auto",
        "choices": [
            {"index": 0, "delta": {"content": "hello"}, "finish_reason": None}
        ],
    }
    obj = ChatCompletionChunk.model_validate(data)
    assert obj.choices[0].delta.content == "hello"


def test_message_tool_calls():
    msg = Message(
        role="assistant",
        content=None,
        tool_calls=[{"id": "tc1", "type": "function", "function": {"name": "get_weather"}}],
    )
    assert msg.tool_calls[0]["id"] == "tc1"


def test_usage_fields():
    u = Usage(prompt_tokens=10, completion_tokens=20, total_tokens=30)
    assert u.prompt_tokens == 10


def test_eval_run():
    run = EvalRun(
        id="eval-1",
        name="accuracy-check",
        dataset_id="ds-1",
        models=["gpt-4", "claude-3"],
        status="completed",
        results=[EvalResult(metric="accuracy", score=0.95)],
    )
    assert run.results[0].score == 0.95
    assert run.status == "completed"


def test_fine_tune_job():
    job = FineTuneJob(
        id="ft-1",
        name="custom-model",
        base_model="llama-3-8b",
        dataset_id="ds-1",
        status="training",
        progress_pct=45.2,
        training_loss=0.42,
    )
    assert job.progress_pct == 45.2
    assert job.status == "training"


def test_deployment():
    dep = Deployment(
        id="dep-1",
        name="prod-v2",
        model="custom-model",
        status="canary",
        region="us-east-1",
        traffic_pct=10.0,
    )
    assert dep.status == "canary"
    assert dep.traffic_pct == 10.0


def test_provider():
    p = Provider(
        id="p-1",
        name="OpenAI",
        provider_type="openai",
        base_url="https://api.openai.com/v1",
        api_key_last4="sk42",
    )
    assert p.enabled is True
    assert p.api_format == "openai"


def test_router_model():
    m = RouterModel(
        id="rm-1",
        name="GPT-4o",
        provider_model_id="gpt-4o",
        provider_id="p-1",
        capabilities=["chat", "function_calling"],
        cost_per_1k_input=0.005,
    )
    assert "function_calling" in m.capabilities


def test_routing_decision():
    d = RoutingDecision(
        id="rd-1",
        name="Code tasks",
        domain="code",
        model_refs=["rm-1", "rm-2"],
        priority=1,
    )
    assert d.domain == "code"
    assert len(d.model_refs) == 2
