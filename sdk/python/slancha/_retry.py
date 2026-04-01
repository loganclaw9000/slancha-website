"""Retry logic with exponential backoff and jitter."""

from __future__ import annotations

import random
import time
from typing import TYPE_CHECKING

import httpx

from slancha.exceptions import APIError, RateLimitError

if TYPE_CHECKING:
    from collections.abc import Callable


_RETRYABLE_STATUS = {429, 500, 502, 503, 504}


def _sleep_duration(attempt: int, retry_after: float | None) -> float:
    """Exponential backoff with full jitter, capped at 60s."""
    if retry_after is not None:
        return retry_after
    base = min(2 ** attempt, 60)
    return random.uniform(0, base)  # noqa: S311


def sync_retry(
    fn: Callable[[], httpx.Response],
    max_retries: int,
) -> httpx.Response:
    """Execute *fn* with retry on 429/5xx. Returns the successful response."""
    last_exc: Exception | None = None
    for attempt in range(max_retries + 1):
        try:
            resp = fn()
        except httpx.TimeoutException as exc:
            last_exc = exc
            if attempt == max_retries:
                break
            time.sleep(_sleep_duration(attempt, None))
            continue

        if resp.status_code not in _RETRYABLE_STATUS:
            return resp

        retry_after: float | None = None
        if ra := resp.headers.get("retry-after"):
            try:
                retry_after = float(ra)
            except ValueError:
                pass

        if resp.status_code == 429:
            last_exc = RateLimitError(
                resp.text, retry_after=retry_after, status_code=429
            )
        else:
            last_exc = APIError(resp.text, status_code=resp.status_code)

        if attempt == max_retries:
            break
        time.sleep(_sleep_duration(attempt, retry_after))

    raise last_exc  # type: ignore[misc]


async def async_retry(
    fn: Callable,
    max_retries: int,
) -> httpx.Response:
    """Async version of sync_retry."""
    import asyncio

    last_exc: Exception | None = None
    for attempt in range(max_retries + 1):
        try:
            resp = await fn()
        except httpx.TimeoutException as exc:
            last_exc = exc
            if attempt == max_retries:
                break
            await asyncio.sleep(_sleep_duration(attempt, None))
            continue

        if resp.status_code not in _RETRYABLE_STATUS:
            return resp

        retry_after: float | None = None
        if ra := resp.headers.get("retry-after"):
            try:
                retry_after = float(ra)
            except ValueError:
                pass

        if resp.status_code == 429:
            last_exc = RateLimitError(
                resp.text, retry_after=retry_after, status_code=429
            )
        else:
            last_exc = APIError(resp.text, status_code=resp.status_code)

        if attempt == max_retries:
            break
        await asyncio.sleep(_sleep_duration(attempt, retry_after))

    raise last_exc  # type: ignore[misc]
