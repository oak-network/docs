# Quickstart

This guide walks you from zero to a working API call in under 5 minutes.

## 1. Install the package

```bash
pnpm add @oaknetwork/api
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
import { createOakClient } from '@oaknetwork/api';
import { Crowdsplit } from '@oaknetwork/api/products/crowdsplit';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const cs = Crowdsplit(client);
```

`createOakClient` configures authentication and retry behavior. `Crowdsplit(client)` bundles all service modules into a single object so you can access `cs.customers`, `cs.payments`, `cs.webhooks`, and everything else from one place.

## 4. Make your first call

```typescript
const result = await cs.customers.list();

if (result.ok) {
  console.log(`Found ${result.value.data.count} customers`);
  for (const customer of result.value.data.customer_list) {
    console.log(`  - ${customer.email}`);
  }
} else {
  console.error('Request failed:', result.error.message);
}
```

Every SDK method returns a `Result<T, OakError>` — a discriminated union that is either `{ ok: true, value: T }` or `{ ok: false, error: OakError }`. Check `result.ok` before accessing the value.

> This pattern replaces try/catch for API calls. The SDK never throws on HTTP errors — it wraps them in the `Result` type. For the full breakdown, see [Error Handling](/docs/sdk/api-sdk/error-handling).

## 5. Create a customer

```typescript
const customer = await cs.customers.create({
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
const payment = await cs.payments.create({
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

## Using individual services

If you only need one service, skip `Crowdsplit` and create it directly:

```typescript
import { createOakClient } from '@oaknetwork/api';
import { createCustomerService } from '@oaknetwork/api/services';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);
const result = await customers.list();
```

This is useful when you want to keep your bundle size small or only interact with a single API resource.

## What to read next

- [Authentication](/docs/sdk/api-sdk/authentication) — how OAuth2 token management works under the hood
- [Payments](/docs/sdk/api-sdk/payments) — create, confirm, and cancel payments across providers
- [Webhooks](/docs/sdk/api-sdk/webhooks) — register endpoints and receive real-time event notifications
- [Error Handling](/docs/sdk/api-sdk/error-handling) — the `Result<T>` pattern, error types, and retry configuration
