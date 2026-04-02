---
sidebar_label: PaymentTreasury
---

# PaymentTreasury

Handles fiat-style payments via a payment gateway. Manages payment creation, confirmation, refunds, fee disbursement, and fund withdrawal for campaigns.

:::info Two treasury variants, one SDK method
The `paymentTreasury()` method works with both on-chain implementations:

| Variant | Description |
|---|---|
| **PaymentTreasury** | Standard payment treasury with no time restrictions. Payments can be created, confirmed, and refunded at any time while the treasury is active. |
| **TimeConstrainedPaymentTreasury** | Time-constrained variant that enforces launch-time and deadline windows on-chain. Payments can only be created within the campaign window (launch → deadline + buffer). Refunds, withdrawals, and fee disbursements are only available after launch. |

Both contracts share the same ABI and the same SDK interface. Time enforcement is handled entirely on-chain — simply pass the deployed contract address regardless of which variant was deployed.
:::

```typescript
const pt = oak.paymentTreasury('0x...contractAddress');
```

## Methods

### Reads

| Method | Returns | Description |
|---|---|---|
| `getPlatformHash()` | `Hex` | Platform hash for this treasury |
| `getPlatformFeePercent()` | `bigint` | Platform fee in basis points |
| `getRaisedAmount()` | `bigint` | Current raised amount |
| `getAvailableRaisedAmount()` | `bigint` | Available raised (raised minus refunded) |
| `getLifetimeRaisedAmount()` | `bigint` | Total ever raised |
| `getRefundedAmount()` | `bigint` | Total refunded amount |
| `getExpectedAmount()` | `bigint` | Total expected pending amount |
| `getPaymentData(paymentId)` | `PaymentData` | Full payment details |
| `cancelled()` | `boolean` | Whether the treasury is cancelled |

### Writes

All write methods return `Promise<Hex>` (transaction hash).

| Method | Description |
|---|---|
| `createPayment(paymentId, buyerId, itemId, paymentToken, amount, expiration, lineItems, externalFees)` | Create a new payment |
| `createPaymentBatch(paymentIds, buyerIds, itemIds, paymentTokens, amounts, expirations, lineItemsArray, externalFeesArray)` | Create multiple payments in one transaction |
| `processCryptoPayment(paymentId, itemId, buyerAddress, paymentToken, amount, lineItems, externalFees)` | Process a crypto payment directly |
| `cancelPayment(paymentId)` | Cancel a pending payment |
| `confirmPayment(paymentId, buyerAddress)` | Confirm a payment |
| `confirmPaymentBatch(paymentIds, buyerAddresses)` | Confirm multiple payments in one transaction |
| `disburseFees()` | Disburse accumulated fees |
| `withdraw()` | Withdraw available funds |
| `claimRefund(paymentId, refundAddress)` | Claim a refund to a specific address |
| `claimRefundSelf(paymentId)` | Claim a refund to the caller's address |
| `claimExpiredFunds()` | Claim funds from expired payments |
| `claimNonGoalLineItems(token)` | Claim non-goal line item funds |
| `pauseTreasury(message)` | Pause the treasury |
| `unpauseTreasury(message)` | Unpause the treasury |
| `cancelTreasury(message)` | Cancel the treasury |

## Types

### LineItem

```typescript
interface LineItem {
  typeId: Hex;    // bytes32 type ID registered in GlobalParams
  amount: bigint; // token amount for this line item
}
```

### ExternalFees

```typescript
interface ExternalFees {
  feeType: Hex;     // bytes32 fee type identifier
  feeAmount: bigint; // fee amount in token units
}
```

### PaymentData

Returned by `getPaymentData()`:

| Field | Type | Description |
|---|---|---|
| `buyerAddress` | `Address` | Buyer's wallet address |
| `buyerId` | `Hex` | Off-chain buyer identifier |
| `itemId` | `Hex` | Item identifier |
| `amount` | `bigint` | Total payment amount |
| `expiration` | `bigint` | Payment expiration timestamp |
| `isConfirmed` | `boolean` | Whether the payment is confirmed |
| `isCryptoPayment` | `boolean` | Whether it was a crypto payment |
| `lineItemCount` | `bigint` | Number of line items |
| `paymentToken` | `Address` | ERC-20 token used for payment |
| `lineItems` | `PaymentLineItem[]` | Line items with config snapshots |
| `externalFees` | `ExternalFees[]` | External fee entries |

## Usage examples

### Create and confirm a payment

```typescript
import { keccak256, toHex, getCurrentTimestamp, addDays } from '@oaknetwork/contracts-sdk';

const paymentId    = keccak256(toHex('payment-001'));
const buyerId      = keccak256(toHex('buyer-alice'));
const itemId       = keccak256(toHex('item-001'));
const paymentToken = '0x...tokenAddress';
const typeId       = keccak256(toHex('product-sale'));

const txHash = await pt.createPayment(
  paymentId,
  buyerId,
  itemId,
  paymentToken,
  50_000n,                          // amount
  addDays(getCurrentTimestamp(), 1), // expires in 1 day
  [{ typeId, amount: 50_000n }],    // lineItems
  [],                               // externalFees
);
await oak.waitForReceipt(txHash);

// Confirm
const confirmTx = await pt.confirmPayment(paymentId, '0x...buyerAddress');
await oak.waitForReceipt(confirmTx);
```

### Query payment data

```typescript
const payment = await pt.getPaymentData(paymentId);

console.log('Amount:', payment.amount);
console.log('Confirmed:', payment.isConfirmed);
console.log('Line items:', payment.lineItems.length);
```

### Process a crypto payment

```typescript
const txHash = await pt.processCryptoPayment(
  paymentId,
  itemId,
  '0x...buyerAddress',
  paymentToken,
  50_000n,
  [{ typeId, amount: 50_000n }],
  [],
);
await oak.waitForReceipt(txHash);
```

### Batch operations

```typescript
// Create multiple payments
const batchTx = await pt.createPaymentBatch(
  [paymentId1, paymentId2],
  [buyerId1, buyerId2],
  [itemId1, itemId2],
  [token, token],
  [10_000n, 20_000n],
  [expiration, expiration],
  [[lineItem1], [lineItem2]],
  [[], []],
);
await oak.waitForReceipt(batchTx);

// Confirm multiple payments
const confirmBatchTx = await pt.confirmPaymentBatch(
  [paymentId1, paymentId2],
  [buyer1, buyer2],
);
await oak.waitForReceipt(confirmBatchTx);
```

### Withdraw and disburse

```typescript
// Disburse accumulated fees to protocol and platform
const disburse = await pt.disburseFees();
await oak.waitForReceipt(disburse);

// Withdraw available funds to the campaign creator
const withdrawTx = await pt.withdraw();
await oak.waitForReceipt(withdrawTx);
```

:::note
When using a `TimeConstrainedPaymentTreasury`, calls made outside the allowed time window will revert on-chain. For example, `createPayment()` will revert if called before launch or after the deadline + buffer period.
:::

## Related

- [CampaignInfo](/docs/contracts-sdk/campaign-info) — the campaign this treasury belongs to
- [GlobalParams](/docs/contracts-sdk/global-params) — line item types and fee configuration
- [TreasuryFactory](/docs/contracts-sdk/treasury-factory) — deploying treasury contracts
