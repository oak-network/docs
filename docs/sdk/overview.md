# Payment SDK

The Payment SDK is Oak Network's toolkit for integrating payments, transfers, subscriptions, and crypto on/off-ramp flows into your application.

## Packages

The Payment SDK is split into focused packages. Use the one that fits your integration.

| Package | npm | What it does |
|---|---|---|
| [**API SDK**](/docs/sdk/api-sdk/overview) | `@oaknetwork/api` | TypeScript client for the Oak Network payment API — customers, payments, webhooks, transfers, subscriptions, and crypto on/off-ramp |
| **Contract SDK** | `@oaknetwork/contracts` | TypeScript bindings for Oak Network smart contracts — coming soon |

## API SDK

The API SDK is production-ready. It wraps the Oak Network REST API with type-safe methods, automatic OAuth2 authentication, and built-in retry logic.

```typescript
import { createOakClient, createPaymentService } from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const payments = createPaymentService(client);
const result = await payments.create({ ... });
```

Start here:

- [API SDK Overview](/docs/sdk/api-sdk/overview) — highlights, services table, quick example
- [Installation](/docs/sdk/api-sdk/installation) — install the package and configure credentials
- [Quickstart](/docs/sdk/api-sdk/quickstart) — your first working integration in under 5 minutes

## Contract SDK

The Contract SDK will provide TypeScript bindings for interacting with Oak Network smart contracts on-chain. It is currently under development.

> For direct smart contract integration today, see the [Smart Contracts](/docs/contracts/overview) documentation.
