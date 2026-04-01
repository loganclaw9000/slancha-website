# Slancha Python SDK

The official Python SDK for the [Slancha](https://slancha.ai) AI inference platform. One endpoint, everything handled.

## Installation

```bash
pip install slancha
```

## Quickstart

```python
from slancha import Slancha

client = Slancha(api_key="sk-...")
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Explain quantum computing in one sentence"}],
)
print(response.choices[0].message.content)
```

That's it. Slancha automatically routes to the best model, optimizes cost, and improves over time.

## Streaming

```python
stream = client.chat.completions.create(
    messages=[{"role": "user", "content": "Write a haiku about APIs"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## Async

```python
import asyncio
from slancha import AsyncSlancha

async def main():
    async with AsyncSlancha(api_key="sk-...") as client:
        response = await client.chat.completions.create(
            messages=[{"role": "user", "content": "Hello!"}],
        )
        print(response.choices[0].message.content)

asyncio.run(main())
```

Async streaming works the same way:

```python
stream = await client.chat.completions.create(
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True,
)
async for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## Error Handling

```python
from slancha import Slancha
from slancha.exceptions import AuthenticationError, RateLimitError, APIError

client = Slancha(api_key="sk-...")

try:
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": "Hello"}],
    )
except AuthenticationError:
    print("Invalid API key")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after}s")
except APIError as e:
    print(f"Server error {e.status_code}: {e}")
```

The SDK automatically retries on 429 and 5xx errors with exponential backoff (default: 3 retries).

## Configuration

```python
client = Slancha(
    api_key="sk-...",
    base_url="https://api.slancha.ai/v1",  # default
    max_retries=3,                          # default, set 0 to disable
    timeout_connect=30.0,                   # seconds
    timeout_read=120.0,                     # seconds
)
```

## OpenAI Compatibility

Slancha uses the OpenAI-compatible `/v1/chat/completions` endpoint. Pass any standard parameter:

```python
response = client.chat.completions.create(
    model="auto",              # default — Slancha picks the best model
    messages=[{"role": "user", "content": "Hello"}],
    temperature=0.7,
    max_tokens=500,
    top_p=0.9,
    stop=["\n"],
)
```

## Requirements

- Python 3.9+
- httpx >= 0.25.0
- pydantic >= 2.0.0

## License

MIT
