"""Slancha Python SDK — one endpoint, everything handled."""

from slancha.async_client import AsyncSlancha
from slancha.client import Slancha
from slancha.exceptions import (
    APIError,
    AuthenticationError,
    RateLimitError,
    SlanchaError,
    TimeoutError,
)
from slancha.models import (
    ChatCompletion,
    ChatCompletionChunk,
    Choice,
    Deployment,
    EvalResult,
    EvalRun,
    FineTuneJob,
    Message,
    Provider,
    RouterModel,
    RoutingDecision,
    Usage,
)

__version__ = "0.1.0"
__all__ = [
    "Slancha",
    "AsyncSlancha",
    "ChatCompletion",
    "ChatCompletionChunk",
    "Choice",
    "Message",
    "Usage",
    "EvalRun",
    "EvalResult",
    "FineTuneJob",
    "Deployment",
    "Provider",
    "RouterModel",
    "RoutingDecision",
    "SlanchaError",
    "AuthenticationError",
    "RateLimitError",
    "APIError",
    "TimeoutError",
]
