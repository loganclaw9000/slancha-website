# Slancha Python SDK Integration Tests

This directory contains integration tests for the Slancha Python SDK. The tests verify that the SDK works correctly end-to-end with the Slancha API.

## Quick Start

### Running with Mocked Backend (Recommended for Local Dev)

For local development without real API credentials, the tests use `respx` to mock the API:

```bash
# Run all integration tests with mocks
pytest tests/integration_test.py -v

# Run with coverage
pytest tests/integration_test.py -v --cov=slancha

# Run specific test
pytest tests/integration_test.py::test_chat_completions_create_sync -v
```

### Running with Real API Credentials

To test against the real Slancha API:

```bash
# Set your API key as an environment variable
export SLANCHA_API_KEY=sk-your-key-here

# Run integration tests against real API
pytest tests/integration_test.py -v -m real
```

**Note:** When running with real credentials, the tests will make actual API calls. Be aware of rate limits and potential costs.

## Test Coverage

The integration tests cover the following functionality:

### Chat Completions
- ✓ Synchronous `chat.completions.create()` calls
- ✓ Asynchronous `chat.completions.create()` calls
- ✓ Model parameter passing
- ✓ Extra kwargs (temperature, max_tokens, etc.)

### Streaming
- ✓ Synchronous streaming response parsing
- ✓ Asynchronous streaming response parsing
- ✓ SSE format parsing and chunk aggregation

### Error Handling
- ✓ 401 Unauthorized → `AuthenticationError`
- ✓ 429 Rate Limited → `RateLimitError` with retry-after
- ✓ 500 Internal Server Error → `APIError`
- ✓ Timeouts → `TimeoutError`

### Retry Logic
- ✓ Retry on 429 with respect to Retry-After header
- ✓ Retry on 5xx server errors
- ✓ Exponential backoff
- ✓ No retry on 401 (non-retryable error)
- ✓ Retry exhaustion handling

### Context Managers
- ✓ Synchronous client context manager (`with Slancha(...)`)
- ✓ Asynchronous client context manager (`async with AsyncSlancha(...)`)

### Management API Stubs
- ✓ `client.providers.*` raises `NotImplementedError`
- ✓ `client.models.*` raises `NotImplementedError`
- ✓ `client.routing.*` raises `NotImplementedError`
- ✓ `client.config.*` raises `NotImplementedError`

### Pydantic Model Validation
- ✓ `ChatCompletion` model parsing and validation
- ✓ `ChatCompletionChunk` model parsing for streaming

### Configuration
- ✓ Custom base_url support
- ✓ Async client custom timeouts

## Test Structure

```
tests/
├── integration_test.py  # All integration tests (mocked by default)
├── test_client.py       # Unit tests for sync client
├── test_async_client.py # Unit tests for async client
├── test_models.py       # Unit tests for Pydantic models
└── conftest.py          # Shared fixtures and test data
```

## Adding New Tests

To add a new integration test:

1. Follow the pattern of existing tests
2. Use `@pytest.mark.asyncio` for async tests
3. Use `respx` for mocking when not testing against real API
4. Include tests for success cases AND error cases
5. Test edge cases (empty responses, unusual parameters, etc.)

Example:

```python
@pytest.mark.asyncio
async def test_my_new_feature():
    with respx.mock(base_url="https://api.slancha.ai/v1") as mock_api:
        mock_api.post("/my-endpoint").respond(200, json={"result": "success"})
        
        client = Slancha(api_key="sk-test")
        resp = client.my_endpoint(param="value")
        
        assert resp == {"result": "success"}
        client.close()
```

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:

- In CI, tests run with mocks by default (no API key required)
- To enable real API tests in CI, add `SLANCHA_API_KEY` as a secret
- Tests fail if they make real API calls without the key set

## Troubleshooting

### "SLANCHA_API_KEY not set" error

This is expected when running with mocks. If you want to run against the real API:

```bash
export SLANCHA_API_KEY=sk-your-key-here
pytest tests/integration_test.py -v
```

### Tests failing due to API rate limits

When running against real API, implement exponential backoff in your code (already built into the SDK). The retry logic handles this automatically.

### Import errors

Ensure you've installed the SDK in development mode:

```bash
cd sdk/python
pip install -e ".[test]"
```

## Notes

- The SDK follows OpenAI's chat completions API format
- All tests pass with mocked backend (recommended for local development)
- Real API integration tests require valid credentials
- Tests verify both sync and async client functionality
- Pydantic models ensure type safety and validation

## Contributing

When submitting changes:
1. Add tests for new functionality
2. Ensure all tests pass: `pytest tests/ -v`
3. Update this README if test coverage changes
4. Document any breaking changes to the API
