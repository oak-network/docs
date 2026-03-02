# Stripe Integration

This example walks through a complete Stripe integration — from creating a customer to collecting a payment. Each step builds on the previous one and uses real SDK methods with the correct payloads.

## Prerequisites

- `@oaknetwork/api` installed and configured ([Installation](/docs/sdk/api-sdk/installation))
- Sandbox credentials ([contact support@oaknetwork.org](mailto:support@oaknetwork.org))

```typescript
import 'dotenv/config';
import {
  createOakClient,
  createCustomerService,
  createProviderService,
  createPaymentMethodService,
  createPaymentService,
} from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);
const providers = createProviderService(client);
const paymentMethods = createPaymentMethodService(client);
const payments = createPaymentService(client);
```

---

## Step 1: Create a customer

Create a customer with an email and country code. The `country_code` is required for Stripe connected account registration in the next step.

```typescript
const customerResult = await customers.create({
  email: 'alice@example.com',
  first_name: 'Alice',
  last_name: 'Smith',
  country_code: 'US',
});

if (!customerResult.ok) {
  console.error('Failed to create customer:', customerResult.error.message);
  process.exit(1);
}

const customerId = customerResult.value.data.id;
console.log('Customer created:', customerId);
```

> The `country_code` field is not required for all flows, but Stripe's `connected_account` role needs it. Set it at creation time to avoid an extra update call later.

## Step 2: Register with Stripe

Before collecting payments, the customer must be registered with Stripe. Choose the role based on your use case:

- **`customer`** — the customer pays through your platform (buyer)
- **`connected_account`** — the customer receives payouts (seller/merchant)

### Register as a Stripe customer

```typescript
const custRegResult = await providers.submitRegistration(customerId, {
  provider: 'stripe',
  target_role: 'customer',
});

if (custRegResult.ok) {
  console.log('Stripe customer status:', custRegResult.value.data.status);
} else {
  console.error('Registration failed:', custRegResult.error.message);
}
```

### Register as a Stripe connected account

```typescript
const caRegResult = await providers.submitRegistration(customerId, {
  provider: 'stripe',
  target_role: 'connected_account',
  provider_data: {
    account_type: 'express',
    transfers_requested: true,
    card_payments_requested: true,
    tax_reporting_us_1099_k_requested: false,
    payouts_debit_negative_balances: false,
    external_account_collection_requested: false,
  },
});

if (caRegResult.ok) {
  console.log('Connected account status:', caRegResult.value.data.status);
}
```

### Stripe KYC onboarding

Connected account registration returns `status: "awaiting_confirmation"`. The response includes Stripe-specific data your frontend needs to redirect the user to complete KYC:

```typescript
if (caRegResult.ok) {
  const { provider_response, readiness } = caRegResult.value.data;

  // Use these in your frontend to launch Stripe's hosted onboarding
  console.log('Client secret:', provider_response.client_secret);
  console.log('Publishable key:', provider_response.publishable_key);
  console.log('Expires at:', new Date(provider_response.expires_at * 1000));

  // Check capability readiness
  console.log('Card payments:', readiness.card_payments);       // "restricted" until KYC completes
  console.log('Transfers:', readiness.transfers);               // "restricted" until KYC completes
}
```

| Response field | Type | Description |
|---|---|---|
| `provider_response.client_secret` | `string` | Stripe account session secret — pass to Stripe.js in your frontend |
| `provider_response.publishable_key` | `string` | Stripe publishable key for the account session |
| `provider_response.expires_at` | `number` | Unix timestamp when the session expires |
| `readiness.card_payments` | `string` | `"restricted"` until KYC is complete, then `"active"` |
| `readiness.transfers` | `string` | `"restricted"` until KYC is complete, then `"active"` |

> Your frontend uses `client_secret` and `publishable_key` to render Stripe's embedded onboarding component. Once the user completes KYC, you receive a `provider_registration.approved` webhook event.

### Verify registration status

```typescript
const statusResult = await providers.getRegistrationStatus(customerId);

if (statusResult.ok) {
  for (const reg of statusResult.value.data) {
    console.log(`${reg.provider} — ${reg.status} — ${reg.target_role}`);
  }
}
```

### Webhook events for this step

| Event | When it fires |
|---|---|
| `provider_registration.approved` | Stripe KYC approved — capabilities are now active |
| `provider_registration.restricted` | Stripe KYC needs additional information |

## Step 3: Add a payment method

Add a payment method to the customer. The type depends on your payment flow.

### Add a Stripe card

```typescript
const cardResult = await paymentMethods.add(customerId, {
  type: 'card',
  provider: 'stripe',
});

if (cardResult.ok) {
  console.log('Card added:', cardResult.value.data.id);
}
```

### Add a bank account

```typescript
const bankResult = await paymentMethods.add(customerId, {
  type: 'bank',
  provider: 'stripe',
  currency: 'usd',
  bank_name: 'Chase',
  bank_account_number: '000123456789',
  bank_routing_number: '021000021',
  bank_account_type: 'checking',
  bank_account_name: 'Alice Smith',
});

if (bankResult.ok) {
  console.log('Bank account added:', bankResult.value.data.id);
}
```

### List payment methods

```typescript
const pmListResult = await paymentMethods.list(customerId);

if (pmListResult.ok) {
  for (const pm of pmListResult.value.data) {
    console.log(`  ${pm.id} — ${pm.type} — ${pm.status}`);
  }
}
```

### Webhook events for this step

| Event | When it fires |
|---|---|
| `payment_method.created` | Payment method successfully added |
| `payment_method.approved` | Payment method verified and active |

## Step 4: Create a payment

Charge the customer using their payment method.

```typescript
const paymentResult = await payments.create({
  provider: 'stripe',
  source: {
    amount: 5000,
    currency: 'usd',
    customer: { id: customerId },
    payment_method: { type: 'card', id: cardResult.value.data.id },
    capture_method: 'automatic',
  },
  confirm: true,
});

if (paymentResult.ok) {
  console.log('Payment status:', paymentResult.value.data.status);
  console.log('Payment ID:', paymentResult.value.data.id);
} else {
  console.error('Payment failed:', paymentResult.error.message);
}
```

| Field | Description |
|---|---|
| `amount` | Amount in smallest currency unit (e.g., `5000` = $50.00) |
| `currency` | Three-letter currency code |
| `customer.id` | The customer UUID from step 1 |
| `payment_method.id` | The payment method ID from step 3 |
| `capture_method` | `"automatic"` captures immediately, `"manual"` requires a separate confirm |
| `confirm` | Set to `true` to confirm the payment in a single call |

### Webhook events for this step

| Event | When it fires |
|---|---|
| `payment.awaiting_confirmation` | Payment created, waiting for confirmation |
| `payment.updated` | Payment status changed |
| `payment.succeeded` | Payment fully processed |
| `payment.captured` | Payment captured (for automatic capture) |
| `payment.failed` | Payment attempt failed |

## Step 5: Set up webhooks

Register a webhook to receive real-time status updates for every step above — provider registrations, payment method changes, and payment events.

```typescript
import { createWebhookService } from '@oaknetwork/api';

const webhooks = createWebhookService(client);

const whResult = await webhooks.register({
  url: 'https://your-server.com/webhooks/oak',
  description: 'Stripe integration events',
});

if (whResult.ok) {
  console.log('Webhook ID:', whResult.value.data.id);
  console.log('Secret:', whResult.value.data.secret);
}
```

> Store the webhook `secret` securely — you need it to [verify signatures](/docs/sdk/api-sdk/webhooks#signature-verification) on incoming payloads.

### Handle events

```typescript
import { parseWebhookPayload } from '@oaknetwork/api';

// Inside your webhook handler
const result = parseWebhookPayload(
  rawBody,
  req.headers['x-oak-signature'] as string,
  process.env.WEBHOOK_SECRET!,
);

if (result.ok) {
  switch (result.value.event) {
    case 'provider_registration.approved':
      // Stripe KYC approved — enable payments for this customer
      break;
    case 'payment.succeeded':
      // Payment complete — fulfill the order
      break;
    case 'payment.failed':
      // Payment failed — notify the buyer
      break;
  }
}
```

### All webhook events in this flow

| Event | Step | Description |
|---|---|---|
| `provider_registration.approved` | 2 | Stripe KYC approved |
| `provider_registration.restricted` | 2 | Stripe KYC needs attention |
| `payment_method.created` | 3 | Payment method added |
| `payment_method.approved` | 3 | Payment method verified |
| `payment.awaiting_confirmation` | 4 | Payment created |
| `payment.captured` | 4 | Payment captured |
| `payment.succeeded` | 4 | Payment fully processed |
| `payment.failed` | 4 | Payment failed |

## Full script

Save this as `stripe-integration.ts` and run with `npx tsx stripe-integration.ts`:

```typescript
import 'dotenv/config';
import {
  createOakClient,
  createCustomerService,
  createProviderService,
  createPaymentMethodService,
  createPaymentService,
} from '@oaknetwork/api';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);
const providers = createProviderService(client);
const paymentMethods = createPaymentMethodService(client);
const payments = createPaymentService(client);

async function main() {
  // 1. Create customer
  const customer = await customers.create({
    email: `stripe_demo_${Date.now()}@example.com`,
    first_name: 'Alice',
    last_name: 'Smith',
    country_code: 'US',
  });

  if (!customer.ok) throw new Error(customer.error.message);
  const customerId = customer.value.data.id;
  console.log('1. Customer created:', customerId);

  // 2. Register with Stripe
  const reg = await providers.submitRegistration(customerId, {
    provider: 'stripe',
    target_role: 'customer',
  });
  console.log('2. Stripe registration:', reg.ok ? reg.value.data.status : reg.error.message);

  // 3. Add a card
  const card = await paymentMethods.add(customerId, {
    type: 'card',
    provider: 'stripe',
  });
  console.log('3. Card added:', card.ok ? card.value.data.id : card.error.message);

  // 4. Create payment
  if (card.ok) {
    const payment = await payments.create({
      provider: 'stripe',
      source: {
        amount: 5000,
        currency: 'usd',
        customer: { id: customerId },
        payment_method: { type: 'card', id: card.value.data.id },
        capture_method: 'automatic',
      },
      confirm: true,
    });
    console.log('4. Payment:', payment.ok ? payment.value.data.status : payment.error.message);
  }
}

main();
```

## What to read next

- [Webhooks](/docs/sdk/api-sdk/webhooks) — receive payment status updates in real time
- [Transfers](/docs/sdk/api-sdk/transfers) — pay out sellers via Stripe transfers
- [Refunds](/docs/sdk/api-sdk/refunds) — issue full or partial refunds
- [E-commerce Payment Flow](/docs/sdk/api-sdk/examples/e-commerce-flow) — end-to-end flow from onboarding through settlement
