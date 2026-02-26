# Quickstart

This guide walks you from zero to a working API call in under 5 minutes.

## 1. Install the package

```bash
pnpm add @oaknetwork/api dotenv
pnpm add -D tsx
```

## 2. Set your credentials

Create a `.env` file in your project root:

```bash
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

## 3. Create a client

```typescript
import 'dotenv/config';
import { createOakClient, createCustomerService, createPaymentService } from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);
const payments = createPaymentService(client);
```

`createOakClient` configures authentication and retry behavior. Each `create*Service(client)` factory returns a typed service instance — import only the services you need.

## 4. Make your first call

```typescript
const result = await customers.list();

if (result.ok) {
  console.log(`Found ${result.value.data.count} customers`);
  for (const customer of result.value.data.customer_list) {
    console.log(`  - ${customer.email}`);
  }
} else {
  console.error('Request failed:', result.error.message);
}
```

Save steps 3 and 4 together in a file (e.g. `index.ts`) and run it:

```bash
npx tsx index.ts
```

Every SDK method returns a `Result<T, OakError>` — a discriminated union that is either `{ ok: true, value: T }` or `{ ok: false, error: OakError }`. Check `result.ok` before accessing the value.

> This pattern replaces try/catch for API calls. The SDK never throws on HTTP errors — it wraps them in the `Result` type. For the full breakdown, see [Error Handling](/docs/sdk/api-sdk/error-handling).

## 5. Create a customer

```typescript
const customer = await customers.create({
  email: 'alice@example.com',
  first_name: 'Alice',
  last_name: 'Smith',
});

if (customer.ok) {
  console.log('Created customer:', customer.value.data.id);
} else {
  console.error('Failed:', customer.error.message);
}
```

## 6. Create a payment

```typescript
const payment = await payments.create({
  provider: 'stripe',
  source: {
    amount: 5000,
    currency: 'usd',
    customer: { id: 'cus_abc123' },
    payment_method: { type: 'card', id: 'pm_xyz789' },
    capture_method: 'automatic',
  },
  confirm: true,
});

if (payment.ok) {
  console.log('Payment status:', payment.value.data.status);
} else {
  console.error('Payment failed:', payment.error.message);
}
```

## Adding more services

Import additional service factories as you need them:

```typescript
import {
  createOakClient,
  createCustomerService,
  createPaymentService,
  createWebhookService,
} from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);
const payments = createPaymentService(client);
const webhooks = createWebhookService(client);
```

All services share the same client — authentication and retry logic are handled once.

## What to read next

- [Authentication](/docs/sdk/api-sdk/authentication) — how OAuth2 token management works under the hood
- [Payments](/docs/sdk/api-sdk/payments) — create, confirm, and cancel payments across providers
- [Webhooks](/docs/sdk/api-sdk/webhooks) — register endpoints and receive real-time event notifications
- [Error Handling](/docs/sdk/api-sdk/error-handling) — the `Result<T>` pattern, error types, and retry configuration
