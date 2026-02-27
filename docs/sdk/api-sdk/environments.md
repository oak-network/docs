# Environments

The SDK supports two built-in environments and an optional custom URL override.

```typescript
import { createOakClient } from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox', // or 'production'
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});
```

## Environment URLs

| Environment | Type | API Base URL | Test operations |
|---|---|---|---|
| `sandbox` | `"sandbox"` | `https://api-stage.usecrowdpay.xyz` | Allowed |
| `production` | `"production"` | `https://app.usecrowdpay.xyz` | Blocked |

## Custom URL

Override the built-in URL by passing `customUrl`. This is useful for local development or self-hosted API instances:

```typescript
const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  customUrl: 'http://localhost:3000',
});
```

When `customUrl` is set, it takes priority over the environment's default URL. The `environment` field is still required — it controls sandbox-only behavior regardless of the URL.

## Environment utilities

The SDK exports helper functions for environment checks:

```typescript
import { getEnvironmentConfig, isTestEnvironment } from '@oaknetwork/api';

const config = getEnvironmentConfig('sandbox');
console.log(config.apiUrl);              // "https://api-stage.usecrowdpay.xyz"
console.log(config.allowsTestOperations); // true

console.log(isTestEnvironment('sandbox'));    // true
console.log(isTestEnvironment('production')); // false
```

## Sandbox-only restrictions

Some SDK operations are restricted to the sandbox environment using the `@SandboxOnly` decorator. If you call a sandbox-only method with `environment: 'production'`, the SDK returns an `EnvironmentViolationError` in the `Result` without making a network request.

```typescript
import { EnvironmentViolationError } from '@oaknetwork/api';

const result = await someService.sandboxOnlyMethod();

if (!result.ok && result.error instanceof EnvironmentViolationError) {
  console.error(result.error.message);
  // → 'Method "sandboxOnlyMethod" is only available in sandbox environment.
  //    Current environment: production.
  //    This method cannot be called in production to prevent accidental data corruption.'
}
```

### How it works

The `@SandboxOnly` decorator (and its function equivalent `sandboxOnlyFn`) checks the `environment` field on the client config before executing the method:

- If `environment === 'sandbox'` — the method runs normally
- If `environment === 'production'` — an `EnvironmentViolationError` is returned (for async methods) or thrown (for sync methods)

This prevents test operations from accidentally running against production data.

> For the full error type reference, see [Error Handling](/docs/sdk/api-sdk/error-handling).
