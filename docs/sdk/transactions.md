# Transactions

A transaction is a ledger record of money movement — every payment, transfer, buy, or sell creates one. Use this service to query your transaction history, filter by status or date range, and settle completed transactions when funds are ready for disbursement.

```typescript
import { createOakClient, createTransactionService } from '@oaknetwork/payments-sdk';

const client = createOakClient({ ... });
const transactions = createTransactionService(client);
```

## Methods

| Method | Description |
|---|---|
| `list(query?)` | List transactions with optional filters |
| `get(id)` | Get a transaction by ID |
| `settle(id, request)` | Settle a completed transaction |

## List transactions

```typescript
const result = await transactions.list({
  limit: 20,
  offset: 0,
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
| `status` | `string` | Comma-separated statuses (e.g., `"succeeded,captured"`) |
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
  status: 'succeeded',
});

if (result.ok) {
  console.log('Settlement successful');
}
```

## Transaction statuses

| Status | Description |
|---|---|
| `created` | Transaction has been created |
| `awaiting_confirmation` | Transaction created, waiting for confirmation |
| `processing` | Transaction is being processed |
| `captured` | Payment has been captured |
| `succeeded` | Transaction completed successfully |
| `failed` | Transaction failed |
| `canceled_after_completion` | Transaction was canceled after completion |
| `canceled` | Transaction was canceled |

## Transaction types

Transactions can be one of 14 types:

`pledge`, `payment`, `pay_out`, `batch_transfer`, `transfer`, `buy`, `sell`, `cancel`, `refund`, `payment_method_verification`, `pledge_with_installment`, `recurring_payment`, `installment_payment`, `external`

## Sub-statuses

Transactions also carry a `sub_status` field with 31 possible values that provide more granular detail about the current state of the transaction.

## Transaction item fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Transaction ID |
| `status` | `Status` | Current status |
| `type` | `TransactionType` | Transaction type (one of 14 values) |
| `sub_status` | `SubStatus` | Granular sub-status |
| `installment` | `Installment` | Installment details (if applicable) |
| `source` | `object` | Payment source details |
| `confirm` | `boolean` | Whether confirmation was requested |
| `metadata` | `object` | Custom metadata |
| `provider` | `string` | Payment provider |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |
