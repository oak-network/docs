# Transfers

A transfer moves funds from your platform to a customer's bank account or wallet. Use transfers to pay out sellers, distribute campaign proceeds, or send refunds via a different channel. Each transfer is routed through a provider (Stripe, PagarMe, or BRLA) and targets a specific payment method on the destination customer.

```typescript
import { createOakClient, createTransferService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const transfers = createTransferService(client);
```

## Methods

| Method | Description |
|---|---|
| `create(transfer)` | Create a new transfer |

## Create a transfer

Transfer requests are provider-specific. Pass the `provider` field to select the request shape.

### Stripe

```typescript
const result = await transfers.create({
  provider: 'stripe',
  source: {
    amount: 2500,
    currency: 'usd',
    customer: { id: 'cus_abc123' },
  },
  destination: {
    customer: { id: 'cus_abc123' },
    payment_method: { type: 'bank', id: 'pm_bank_xyz' },
  },
  metadata: {
    reference_id: 'payout_001',
  },
  provider_data: {
    statement_descriptor: 'OAK PAYOUT',
  },
});

if (result.ok) {
  console.log('Transfer ID:', result.value.data.id);
  console.log('Status:', result.value.data.status);
}
```

### PagarMe

```typescript
const result = await transfers.create({
  provider: 'pagar_me',
  source: {
    amount: 10000,
    currency: 'brl',
  },
  metadata: {
    campaign_id: 'camp_001',
  },
});
```

### BRLA

```typescript
const result = await transfers.create({
  provider: 'brla',
  source: {
    amount: 5000,
    currency: 'brla',
    customer: { id: 'cus_abc123' },
  },
  destination: {
    customer: { id: 'cus_def456' },
    payment_method: {
      type: 'customer_wallet',
      chain: 'polygon',
      evm_address: '0x1234...abcd',
    },
  },
});
```

## Provider request fields

| Field | Stripe | PagarMe | BRLA |
|---|---|---|---|
| `provider` | `"stripe"` | `"pagar_me"` | `"brla"` |
| `source.currency` | `"usd"` | `"brl"` | `"brla"` |
| `source.customer` | Required | — | Optional |
| `destination.customer` | Required (same as source) | — | Optional |
| `destination.payment_method` | Bank PM by ID | — | Wallet or PM by ID |
| `provider_data` | `statement_descriptor` | — | `wallet_memo` |

## Response

The response data extends the original request with:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Transfer ID |
| `status` | `string` | Transfer status (e.g., `"created"`) |
| `type` | `"transfer"` | Always `"transfer"` |
| `provider` | `string` | Provider used |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |
