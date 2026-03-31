"""Slancha SDK exceptions."""

from __future__ import annotations


class SlanchaError(Exception):
    """Base exception for all Slancha SDK errors."""

    def __init__(self, message: str, status_code: int | None = None, body: dict | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.body = body or {}


class AuthenticationError(SlanchaError):
    """Raised when the API key is missing or invalid (401)."""


class RateLimitError(SlanchaError):
    """Raised when the rate limit is exceeded (429)."""

    def __init__(self, message: str, retry_after: float | None = None, **kwargs):
        super().__init__(message, **kwargs)
        self.retry_after = retry_after


class APIError(SlanchaError):
    """Raised for server-side errors (5xx)."""


class TimeoutError(SlanchaError):
    """Raised when a request times out."""
