# Authentication

The SDK authenticates with the Oak Network API using OAuth2 client credentials. Token management is automatic — you pass your credentials once and the SDK handles the rest.

## How it works

```typescript
import { createOakClient } from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});
```

When you create a client, it does **not** immediately request a token. The first token is fetched lazily — on the first API call that requires authentication.

## Token lifecycle

The SDK manages tokens internally through the `AuthManager`:

1. On the first authenticated request, the SDK calls `POST /api/v1/merchant/token/grant` with your `clientId` and `clientSecret`
2. The API returns an `access_token` and an `expires_in` value (in seconds)
3. The SDK caches the token and converts the expiration to an absolute timestamp
4. On subsequent requests, the cached token is reused
5. When the token is within **60 seconds** of expiring, the SDK automatically requests a fresh one
6. Concurrent callers share a single in-flight refresh — no duplicate token requests

You never need to manually refresh tokens.

## Token request

```typescript
// Request payload (sent automatically)
{
  client_id: "your-client-id",
  client_secret: "your-client-secret",
  grant_type: "client_credentials"
}

// Response
{
  access_token: "eyJhbGci...",
  token_type: "Bearer",
  expires_in: 3600
}
```

## Manual token access

In rare cases you may need the raw access token — for example, to make direct HTTP calls outside the SDK.

```typescript
const tokenResult = await client.getAccessToken();

if (tokenResult.ok) {
  const token = tokenResult.value;
  // Use token in a custom HTTP request
  fetch('https://api-stage.usecrowdpay.xyz/api/v1/some-endpoint', {
    headers: { Authorization: `Bearer ${token}` },
  });
} else {
  console.error('Token request failed:', tokenResult.error.message);
}
```

You can also call `grantToken()` to force a fresh token request regardless of cache state:

```typescript
const grantResult = await client.grantToken();

if (grantResult.ok) {
  console.log('Token type:', grantResult.value.token_type);
  console.log('Expires in:', grantResult.value.expires_in, 'seconds');
}
```

## Client configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `environment` | `"sandbox" \| "production"` | Yes | Target environment |
| `clientId` | `string` | Yes | OAuth2 client ID |
| `clientSecret` | `string` | Yes | OAuth2 client secret |
| `customUrl` | `string` | No | Override the built-in API base URL |
| `retryOptions` | `Partial<RetryOptions>` | No | Override default [retry behavior](/docs/sdk/api-sdk/error-handling#retry-configuration) |

> `clientSecret` is not exposed on `client.config` after creation — store it separately if you need it for non-SDK purposes. All service methods handle authentication transparently. You only need to interact with `getAccessToken()` or `grantToken()` if you are making direct HTTP calls outside the SDK.
