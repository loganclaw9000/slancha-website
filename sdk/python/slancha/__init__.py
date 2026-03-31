"""Slancha Python SDK — one endpoint, everything handled."""

from slancha.client import Slancha, AsyncSlancha
from slancha.models import (
    ChatCompletion,
    ChatCompletionChunk,
    Choice,
    Message,
    Usage,
    EvalRun,
    EvalResult,
    FineTuneJob,
    Deployment,
)
from slancha.exceptions import (
    SlanchaError,
    AuthenticationError,
    RateLimitError,
    APIError,
    TimeoutError,
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
    "SlanchaError",
    "AuthenticationError",
    "RateLimitError",
    "APIError",
    "TimeoutError",
]
