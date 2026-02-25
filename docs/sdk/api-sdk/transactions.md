# Transactions

A transaction is a ledger record of money movement — every payment, transfer, buy, or sell creates one. Use this service to query your transaction history, filter by status or date range, and settle completed transactions when funds are ready for disbursement.

```typescript
import { createOakClient, createTransactionService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const transactions = createTransactionService(client);
```

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `list(query?)` | `GET /api/v1/transactions` | List transactions with optional filters |
| `get(id)` | `GET /api/v1/transactions/{id}` | Get a transaction by ID |
| `settle(id, request)` | `PATCH /api/v1/transactions/{id}/settle` | Settle a completed transaction |

## List transactions

```typescript
const result = await transactions.list({
  limit: 20,
  offset: 0,
  status: 'COMPLETED',
});

if (result.ok) {
  console.log(`Total: ${result.value.data.count}`);
  for (const tx of result.value.data.transaction_list) {
    console.log(`  ${tx.id} — ${tx.type} — ${tx.status}`);
  }
}
```

### Query parameters

| Parameter | Type | Description |
|---|---|---|
| `limit` | `number` | Maximum number of results |
| `offset` | `number` | Number of results to skip |
| `customer_id` | `string` | Filter by customer UUID |
| `type_list` | `string` | Filter by type (e.g., `"installment_payment"`) |
| `status` | `string` | Comma-separated statuses (e.g., `"COMPLETED,SETTLED"`) |
| `payment_method` | `string` | Filter by payment method (e.g., `"pix"`) |
| `dateFrom` | `string` | Start date filter (`YYYY-MM-DD`) |
| `dateTo` | `string` | End date filter (`YYYY-MM-DD`) |
| `source_currency` | `string` | Filter by source currency |
| `destination_currency` | `string` | Filter by destination currency |

## Get a transaction

```typescript
const result = await transactions.get('tx_abc123');

if (result.ok) {
  const tx = result.value.data;
  console.log('Status:', tx.status);
  console.log('Provider:', tx.provider);
  console.log('Created:', tx.created_at);
}
```

## Settle a transaction

```typescript
const result = await transactions.settle('tx_abc123', {
  charge_id: 'ch_xyz789',
  amount: 5000,
  status: 'SETTLED',
});

if (result.ok) {
  console.log('Settlement successful');
}
```

## Transaction statuses

| Status | Description |
|---|---|
| `INITIATED` | Transaction has been created but not yet processed |
| `PENDING` | Transaction is being processed |
| `COMPLETED` | Transaction completed successfully |
| `SETTLED` | Funds have been settled to the recipient |
| `FAILED` | Transaction failed |
| `CANCELED_AFTER_COMPLETION` | Transaction was cancelled after completion |

## Transaction item fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Transaction ID |
| `status` | `Status` | Current status |
| `type` | `string` | Transaction type |
| `source` | `object` | Payment source details |
| `confirm` | `boolean` | Whether confirmation was requested |
| `metadata` | `object` | Custom metadata |
| `provider` | `string` | Payment provider |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |
