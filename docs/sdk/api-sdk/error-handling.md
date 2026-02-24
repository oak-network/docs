# Error Handling

Every SDK method returns a `Result<T, OakError>` instead of throwing exceptions. This gives you explicit control over success and failure paths at the type level.

## The Result pattern

```typescript
const result = await customers.get('cus_123');

if (result.ok) {
  // result.value is fully typed as Customer.Response
  console.log(result.value.data.email);
} else {
  // result.error is an OakError (or subclass)
  console.error(result.error.message);
}
```

`Result<T, E>` is a discriminated union:

```typescript
type Result<T, E = OakError> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

The SDK also exports `ok()` and `err()` helpers if you need to create `Result` values in your own code:

```typescript
import { ok, err } from '@oaknetwork/api';

function validate(input: string): Result<string> {
  if (input.length === 0) return err(new OakError('Input cannot be empty'));
  return ok(input);
}
```

## Error types

All errors extend `OakError`. Check the error class to determine what went wrong.

| Error class | When it occurs | Key fields |
|---|---|---|
| `OakError` | Base class for all SDK errors | `message`, `cause` |
| `SDKError` | Internal SDK logic errors | `message`, `cause` |
| `ApiError` | Non-2xx HTTP response from the API | `status`, `body`, `headers` |
| `NetworkError` | Request failed to reach the server (DNS, timeout, connection refused) | `isNetworkError: true` |
| `AbortError` | Request was cancelled via `AbortSignal` | `message` |
| `ParseError` | Response body was not valid JSON | `message`, `cause` |
| `EnvironmentViolationError` | A sandbox-only method was called in production | `methodName`, `environment` |

## Handling API errors

`ApiError` is the most common error type. It contains the HTTP status code, the parsed response body, and response headers.

```typescript
import { ApiError } from '@oaknetwork/api';

const result = await payments.create(paymentRequest);

if (!result.ok) {
  const error = result.error;

  if (error instanceof ApiError) {
    console.error('HTTP status:', error.status);
    console.error('Response body:', error.body);
    console.error('Headers:', error.headers);
  } else {
    console.error('Non-API error:', error.message);
  }
}
```

## Retry configuration

The SDK includes built-in retry logic with exponential backoff. Configure it when creating the client.

```typescript
const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  retryOptions: {
    maxNumberOfRetries: 3,
    delay: 1000,
    backoffFactor: 2,
    maxDelay: 30000,
  },
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `maxNumberOfRetries` | `number` | `0` | Maximum number of retry attempts. Set to `0` to disable retries. |
| `delay` | `number` | `500` | Initial delay in milliseconds before the first retry |
| `backoffFactor` | `number` | `2` | Multiplier applied to the delay after each retry |
| `maxDelay` | `number` | `30000` | Maximum delay cap in milliseconds |
| `retryOnStatus` | `number[]` | `[408, 429, 500, 502, 503, 504]` | HTTP status codes that trigger a retry |
| `retryOnError` | `(error) => boolean` | Network errors only | Custom function to decide if an error is retryable |
| `onRetry` | `(attempt, error) => void` | Console warning | Callback fired before each retry attempt |
| `signal` | `AbortSignal` | — | Signal to cancel retries |

The retry handler also respects the `Retry-After` header when the API returns `429 Too Many Requests`.

## Sandbox-only methods

Some operations are restricted to the sandbox environment. If you call a sandbox-only method in production, the SDK returns an `EnvironmentViolationError` without making a network request.

```typescript
if (!result.ok && result.error instanceof EnvironmentViolationError) {
  console.error(
    `"${result.error.methodName}" is only available in sandbox. ` +
    `Current environment: ${result.error.environment}`
  );
}
```

> For more on environment behavior, see [Environments](/docs/sdk/api-sdk/environments).
