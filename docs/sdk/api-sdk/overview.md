---
sidebar_label: Introduction
---

# API SDK

The `@oaknetwork/api` package is a TypeScript SDK that wraps the Oak Network payment API — handling authentication, retries, and type safety so you can focus on building your integration.

## Highlights

- **Initialize a client** for sandbox or production: `createOakClient({ environment: 'sandbox', ... })`
- **Standalone service factories** — import only what you need: `createCustomerService(client)`, `createPaymentService(client)`, etc.
- **Type-safe results** on every call: every method returns `Result<T, OakError>` — no uncaught exceptions
- **Built-in retry** with exponential backoff, jitter, and `Retry-After` header support
- **Webhook signature verification** built in: `verifyWebhookSignature()` and `parseWebhookPayload()`
- **Two environments** out of the box: `sandbox` and `production`, plus `customUrl` for self-hosted setups

## Quick example

```typescript
import { createOakClient, createCustomerService } from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);

const result = await customers.list();

if (result.ok) {
  console.log(result.value.data);
} else {
  console.error(result.error.message);
}
```

> See the full walkthrough in the [Quickstart](/docs/sdk/api-sdk/quickstart) guide.

## Services

The SDK ships 10 service modules. Import the factory function for each service you need.

| Service | Factory | What it does |
|---|---|---|
| [`CustomerService`](/docs/sdk/api-sdk/customers) | `createCustomerService(client)` | Create, get, list, update, sync, and check balances |
| [`PaymentService`](/docs/sdk/api-sdk/payments) | `createPaymentService(client)` | Create, confirm, cancel payments |
| [`PaymentMethodService`](/docs/sdk/api-sdk/payment-methods) | `createPaymentMethodService(client)` | Add, list, get, delete payment methods |
| [`WebhookService`](/docs/sdk/api-sdk/webhooks) | `createWebhookService(client)` | Register, manage, and monitor webhooks |
| [`TransactionService`](/docs/sdk/api-sdk/transactions) | `createTransactionService(client)` | List, get, and settle transactions |
| [`TransferService`](/docs/sdk/api-sdk/transfers) | `createTransferService(client)` | Create provider transfers (Stripe, PagarMe, BRLA) |
| [`PlanService`](/docs/sdk/api-sdk/plans) | `createPlanService(client)` | CRUD subscription plans |
| [`RefundService`](/docs/sdk/api-sdk/refunds) | `createRefundService(client)` | Refund a payment |
| [`BuyService`](/docs/sdk/api-sdk/buy-and-sell) | `createBuyService(client)` | Crypto on-ramp via Bridge |
| [`SellService`](/docs/sdk/api-sdk/buy-and-sell) | `createSellService(client)` | Crypto off-ramp via Avenia |

## Next up

- [Installation](/docs/sdk/api-sdk/installation) — install the package and configure credentials
- [Quickstart](/docs/sdk/api-sdk/quickstart) — your first working integration in under 5 minutes
- [Error Handling](/docs/sdk/api-sdk/error-handling) — understand the `Result<T>` pattern and error types
