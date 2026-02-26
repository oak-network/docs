# Installation

The `@oaknetwork/api` package is published on npm. Install it with your preferred package manager.

```bash
pnpm add @oaknetwork/api
```

> You can also use `npm install @oaknetwork/api` or `yarn add @oaknetwork/api`.

## Requirements

- `@oaknetwork/api` **>= 1.0.0**
- Node.js 18 or later
- TypeScript 5.x recommended (the SDK ships type declarations)

## Environment variables

The SDK authenticates using OAuth2 client credentials. Store your credentials in environment variables — never hardcode them.

```bash
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

| Variable | Required | Description |
|---|---|---|
| `CLIENT_ID` | Yes | Your merchant client ID from the Oak Network dashboard |
| `CLIENT_SECRET` | Yes | Your merchant client secret |

> Install `dotenv` if you want to load variables from a `.env` file: `pnpm add dotenv`. Then add `import 'dotenv/config'` at the top of your entry file.

## Environments

The SDK supports two built-in environments. Pass the `environment` field when creating a client.

| Environment | API Base URL | Test operations |
|---|---|---|
| `sandbox` | `https://api-stage.usecrowdpay.xyz` | Allowed |
| `production` | `https://app.usecrowdpay.xyz` | Blocked |

```typescript
import { createOakClient } from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});
```

To point the SDK at a custom API server, pass `customUrl` — it overrides the built-in environment URL:

```typescript
const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  customUrl: 'https://my-dev-server.example.com',
});
```

> For a full breakdown of environment behavior, sandbox-only restrictions, and the `@SandboxOnly` decorator, see [Environments](/docs/sdk/api-sdk/environments).
