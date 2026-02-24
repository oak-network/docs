# Transfers

The `TransferService` creates payouts and fund transfers to customers through various payment providers.

```typescript
import { createOakClient, createTransferService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const transfers = createTransferService(client);
```

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `create(transfer)` | `POST /api/v1/transfer` | Create a new transfer |

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
