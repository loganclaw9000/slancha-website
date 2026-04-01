"""Slancha SDK data models — Pydantic v2."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


# ── Chat Completions (OpenAI-compatible) ────────────────────────────


class Message(BaseModel):
    role: Literal["system", "user", "assistant", "tool"]
    content: str | None = None
    name: str | None = None
    tool_calls: list[dict[str, Any]] | None = None
    tool_call_id: str | None = None


class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class Choice(BaseModel):
    index: int
    message: Message
    finish_reason: str | None = None
    logprobs: dict[str, Any] | None = None


class ChatCompletion(BaseModel):
    id: str
    object: Literal["chat.completion"] = "chat.completion"
    created: int
    model: str
    choices: list[Choice]
    usage: Usage | None = None
    system_fingerprint: str | None = None


class ChoiceDelta(BaseModel):
    role: str | None = None
    content: str | None = None
    tool_calls: list[dict[str, Any]] | None = None


class StreamChoice(BaseModel):
    index: int
    delta: ChoiceDelta
    finish_reason: str | None = None


class ChatCompletionChunk(BaseModel):
    id: str
    object: Literal["chat.completion.chunk"] = "chat.completion.chunk"
    created: int
    model: str
    choices: list[StreamChoice]
    usage: Usage | None = None
    system_fingerprint: str | None = None


# ── Evaluations ─────────────────────────────────────────────────────


class EvalResult(BaseModel):
    metric: str
    score: float
    details: dict[str, Any] = Field(default_factory=dict)


class EvalRun(BaseModel):
    id: str
    name: str
    dataset_id: str
    models: list[str]
    scores: dict[str, Any] = Field(default_factory=dict)
    status: Literal["pending", "running", "completed", "failed"] = "pending"
    results: list[EvalResult] = Field(default_factory=list)
    created_at: str | None = None
    completed_at: str | None = None


# ── Fine-Tuning ─────────────────────────────────────────────────────


class FineTuneJob(BaseModel):
    id: str
    name: str
    base_model: str
    dataset_id: str
    status: Literal["queued", "training", "completed", "failed"] = "queued"
    progress_pct: float = 0.0
    training_loss: float | None = None
    eval_accuracy: float | None = None
    epochs: int = 3
    created_at: str | None = None
    completed_at: str | None = None


# ── Deployments ─────────────────────────────────────────────────────


class Deployment(BaseModel):
    id: str
    name: str
    model: str
    version: str | None = None
    status: Literal["active", "canary", "rolling", "stopped"] = "active"
    region: str | None = None
    gpu_type: str | None = None
    traffic_pct: float = 100.0
    created_at: str | None = None


# ── Router / Provider Management ────────────────────────────────────


class Provider(BaseModel):
    id: str
    name: str
    provider_type: str
    base_url: str
    api_format: str = "openai"
    enabled: bool = True
    api_key_last4: str | None = None


class RouterModel(BaseModel):
    id: str
    name: str
    provider_model_id: str
    provider_id: str
    capabilities: list[str] = Field(default_factory=list)
    cost_per_1k_input: float | None = None
    cost_per_1k_output: float | None = None
    is_default: bool = False


class RoutingDecision(BaseModel):
    id: str
    name: str
    description: str | None = None
    domain: str
    model_refs: list[str] = Field(default_factory=list)
    system_prompt: str | None = None
    enabled: bool = True
    priority: int = 0
