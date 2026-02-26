# Refunds

A refund returns funds from a completed payment back to the customer. Issue a full refund to reverse the entire charge, or a partial refund to return a specific amount. The refund is processed through the same provider that handled the original payment.

```typescript
import { createOakClient, createRefundService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const refunds = createRefundService(client);
```

> `RefundService` operates on a specific payment ID — pass the payment ID when calling `create`.

## Methods

| Method | Description |
|---|---|
| `create(paymentId, refund)` | Refund a payment |

## Create a refund

### Full refund

Omit `amount` to refund the full payment:

```typescript
const result = await refunds.create('pay_abc123', {});

if (result.ok) {
  console.log('Refund ID:', result.value.data.id);
  console.log('Status:', result.value.data.status);
}
```

### Partial refund

Pass `amount` to refund a specific amount:

```typescript
const result = await refunds.create('pay_abc123', {
  amount: 2500,
  metadata: {
    reason: 'Customer requested partial refund',
  },
});

if (result.ok) {
  console.log('Refund ID:', result.value.data.id);
  console.log('Amount:', result.value.data.amount);
}
```

## Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | `number` | No | Amount to refund. Omit for a full refund. |
| `metadata` | `Record<string, any>` | No | Custom metadata attached to the refund |

## Response data

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Refund ID |
| `status` | `string` | Refund status (e.g., `"created"`) |
| `type` | `"refund"` | Always `"refund"` |
| `amount` | `number` | Refunded amount |
| `provider` | `string` | Provider that processed the refund |
