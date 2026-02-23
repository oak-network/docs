# Refunds

The `RefundService` issues refunds against completed payments.

```typescript
import { createOakClient } from '@oaknetwork/api';
import { createRefundService } from '@oaknetwork/api/services';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const refunds = createRefundService(client);
```

> `RefundService` is not included in the `Crowdsplit` bundle because it operates on a specific payment ID rather than a standalone resource.

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `create(paymentId, refund)` | `POST /api/v1/payments/{paymentId}/refund` | Refund a payment |

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
