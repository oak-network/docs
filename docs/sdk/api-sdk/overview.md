---
sidebar_label: Introduction
---

# API SDK

The `@oaknetwork/api` package is a TypeScript SDK that wraps the Oak Network payment API — handling authentication, retries, and type safety so you can focus on building your integration.

## Highlights

- **Initialize a client** for sandbox or production: `createOakClient({ environment: 'sandbox', ... })`
- **Bundle all services** into one object: `Crowdsplit(client)`
- **Type-safe results** on every call: every method returns `Result<T, OakError>` — no uncaught exceptions
- **Built-in retry** with exponential backoff, jitter, and `Retry-After` header support
- **Two environments** out of the box: `sandbox` and `production`, plus `customUrl` for self-hosted setups

## Quick example

```typescript
import { createOakClient } from '@oaknetwork/api';
import { Crowdsplit } from '@oaknetwork/api/products/crowdsplit';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const cs = Crowdsplit(client);

const result = await cs.customers.list();

if (result.ok) {
  console.log(result.value.data);
} else {
  console.error(result.error.message);
}
```

> See the full walkthrough in the [Quickstart](/docs/sdk/api-sdk/quickstart) guide.

## Services

The SDK ships 10 service modules. Use them individually via factory functions, or access them all at once through the `Crowdsplit(client)` bundle.

| Service | Property | What it does |
|---|---|---|
| `CustomerService` | `cs.customers` | Create, get, list, update customers |
| `PaymentService` | `cs.payments` | Create, confirm, cancel payments |
| `PaymentMethodService` | `cs.paymentMethods` | Add, list, get, delete payment methods |
| `WebhookService` | `cs.webhooks` | Register, manage, and monitor webhooks |
| `TransactionService` | `cs.transactions` | List, get, and settle transactions |
| `TransferService` | `cs.transfers` | Create provider transfers (Stripe, PagarMe, BRLA) |
| `PlanService` | `cs.plans` | CRUD subscription plans |
| `RefundService` | — | Refund a payment |
| `BuyService` | `cs.buy` | Crypto on-ramp via Bridge |
| `SellService` | `cs.sell` | Crypto off-ramp via Avenia |

> `RefundService` is used standalone via `createRefundService(client)` since it operates on a specific payment ID. See [Refunds](/docs/sdk/api-sdk/refunds).

## Next up

- [Installation](/docs/sdk/api-sdk/installation) — install the package and configure credentials
- [Quickstart](/docs/sdk/api-sdk/quickstart) — your first working integration in under 5 minutes
- [Error Handling](/docs/sdk/api-sdk/error-handling) — understand the `Result<T>` pattern and error types
