# Events

Every contract entity exposes an `events` property with three capabilities:

1. **Fetch historical logs** — query past event logs from the blockchain
2. **Decode raw logs** — parse raw transaction receipt logs into typed event objects
3. **Watch live events** — subscribe to real-time event notifications

## Fetching historical logs

Each event has a `get*Logs()` method that returns all matching logs from the entire chain history. You can optionally pass `{ fromBlock, toBlock }` to narrow the search range.

```typescript
const gp = oak.globalParams('0x...');

// All PlatformEnlisted events ever emitted by this contract
const logs = await gp.events.getPlatformEnlistedLogs();

for (const log of logs) {
  console.log(log.eventName); // "PlatformEnlisted"
  console.log(log.args); // { platformHash: "0x...", adminAddress: "0x...", ... }
}

// Filter by block range
const recentLogs = await gp.events.getPlatformEnlistedLogs({
  fromBlock: 1_000_000n,
  toBlock: 2_000_000n,
});
```

## Decoding raw logs

Use `decodeLog()` to decode a raw log from a transaction receipt. This is useful when you have a receipt and want to decode its logs without knowing which event they belong to.

```typescript
const receipt = await oak.waitForReceipt(txHash);

for (const log of receipt.logs) {
  try {
    const decoded = gp.events.decodeLog({
      topics: log.topics,
      data: log.data,
    });
    console.log(decoded.eventName, decoded.args);
  } catch {
    // Log doesn't match any event in this contract's ABI
  }
}
```

## Watching live events

Each event has a `watch*()` method that subscribes to real-time event notifications. The method returns an `unwatch` function to stop listening.

```typescript
const gp = oak.globalParams('0x...');

// Start watching for new PlatformEnlisted events
const unwatch = gp.events.watchPlatformEnlisted((logs) => {
  for (const log of logs) {
    console.log('New platform enlisted:', log.args);
  }
});

// Later — stop watching
unwatch();
```

## Available events per contract

### GlobalParams

```typescript
const gp = oak.globalParams("0x...");

// Fetch historical logs
await gp.events.getPlatformEnlistedLogs(options?);
await gp.events.getPlatformDelistedLogs(options?);
await gp.events.getPlatformAdminAddressUpdatedLogs(options?);
await gp.events.getPlatformDataAddedLogs(options?);
await gp.events.getPlatformDataRemovedLogs(options?);
await gp.events.getPlatformAdapterSetLogs(options?);
await gp.events.getPlatformClaimDelayUpdatedLogs(options?);
await gp.events.getProtocolAdminAddressUpdatedLogs(options?);
await gp.events.getProtocolFeePercentUpdatedLogs(options?);
await gp.events.getTokenAddedToCurrencyLogs(options?);
await gp.events.getTokenRemovedFromCurrencyLogs(options?);
await gp.events.getOwnershipTransferredLogs(options?);
await gp.events.getPausedLogs(options?);
await gp.events.getUnpausedLogs(options?);

// Decode a raw log
gp.events.decodeLog({ topics, data });

// Watch live events
const unwatch = gp.events.watchPlatformEnlisted(handler);
const unwatch = gp.events.watchPlatformDelisted(handler);
const unwatch = gp.events.watchTokenAddedToCurrency(handler);
const unwatch = gp.events.watchTokenRemovedFromCurrency(handler);
```

### CampaignInfoFactory

```typescript
const factory = oak.campaignInfoFactory("0x...");

await factory.events.getCampaignCreatedLogs(options?);
await factory.events.getCampaignInitializedLogs(options?);
await factory.events.getOwnershipTransferredLogs(options?);
factory.events.decodeLog({ topics, data });
const unwatch = factory.events.watchCampaignCreated(handler);
```

### TreasuryFactory

```typescript
const tf = oak.treasuryFactory("0x...");

await tf.events.getTreasuryDeployedLogs(options?);
await tf.events.getImplementationRegisteredLogs(options?);
await tf.events.getImplementationRemovedLogs(options?);
await tf.events.getImplementationApprovalLogs(options?);
tf.events.decodeLog({ topics, data });
const unwatch = tf.events.watchTreasuryDeployed(handler);
const unwatch = tf.events.watchImplementationRegistered(handler);
```

### CampaignInfo

```typescript
const ci = oak.campaignInfo("0x...");

await ci.events.getDeadlineUpdatedLogs(options?);
await ci.events.getGoalAmountUpdatedLogs(options?);
await ci.events.getLaunchTimeUpdatedLogs(options?);
await ci.events.getPlatformInfoUpdatedLogs(options?);
await ci.events.getSelectedPlatformUpdatedLogs(options?);
await ci.events.getOwnershipTransferredLogs(options?);
await ci.events.getPausedLogs(options?);
await ci.events.getUnpausedLogs(options?);
ci.events.decodeLog({ topics, data });
const unwatch = ci.events.watchDeadlineUpdated(handler);
const unwatch = ci.events.watchPlatformInfoUpdated(handler);
const unwatch = ci.events.watchSelectedPlatformUpdated(handler);
```

### PaymentTreasury

```typescript
const pt = oak.paymentTreasury("0x...");

await pt.events.getPaymentCreatedLogs(options?);
await pt.events.getPaymentCancelledLogs(options?);
await pt.events.getPaymentConfirmedLogs(options?);
await pt.events.getPaymentBatchConfirmedLogs(options?);
await pt.events.getPaymentBatchCreatedLogs(options?);
await pt.events.getFeesDisbursedLogs(options?);
await pt.events.getWithdrawalWithFeeSuccessfulLogs(options?);
await pt.events.getRefundClaimedLogs(options?);
await pt.events.getNonGoalLineItemsClaimedLogs(options?);
await pt.events.getExpiredFundsClaimedLogs(options?);
pt.events.decodeLog({ topics, data });
const unwatch = pt.events.watchPaymentCreated(handler);
const unwatch = pt.events.watchPaymentConfirmed(handler);
const unwatch = pt.events.watchPaymentCancelled(handler);
const unwatch = pt.events.watchRefundClaimed(handler);
const unwatch = pt.events.watchFeesDisbursed(handler);
```

### AllOrNothing Treasury

```typescript
const aon = oak.allOrNothingTreasury("0x...");

await aon.events.getReceiptLogs(options?);
await aon.events.getRefundClaimedLogs(options?);
await aon.events.getWithdrawalSuccessfulLogs(options?);
await aon.events.getFeesDisbursedLogs(options?);
await aon.events.getRewardsAddedLogs(options?);
await aon.events.getRewardRemovedLogs(options?);
await aon.events.getPausedLogs(options?);
await aon.events.getUnpausedLogs(options?);
await aon.events.getTransferLogs(options?);
await aon.events.getSuccessConditionNotFulfilledLogs(options?);
aon.events.decodeLog({ topics, data });
const unwatch = aon.events.watchReceipt(handler);
const unwatch = aon.events.watchRefundClaimed(handler);
const unwatch = aon.events.watchWithdrawalSuccessful(handler);
const unwatch = aon.events.watchFeesDisbursed(handler);
```

### KeepWhatsRaised Treasury

```typescript
const kwr = oak.keepWhatsRaisedTreasury("0x...");

await kwr.events.getReceiptLogs(options?);
await kwr.events.getRefundClaimedLogs(options?);
await kwr.events.getWithdrawalWithFeeSuccessfulLogs(options?);
await kwr.events.getWithdrawalApprovedLogs(options?);
await kwr.events.getFeesDisbursedLogs(options?);
await kwr.events.getTreasuryConfiguredLogs(options?);
await kwr.events.getRewardsAddedLogs(options?);
await kwr.events.getRewardRemovedLogs(options?);
await kwr.events.getTipClaimedLogs(options?);
await kwr.events.getFundClaimedLogs(options?);
await kwr.events.getDeadlineUpdatedLogs(options?);
await kwr.events.getGoalAmountUpdatedLogs(options?);
await kwr.events.getPaymentGatewayFeeSetLogs(options?);
await kwr.events.getPausedLogs(options?);
await kwr.events.getUnpausedLogs(options?);
await kwr.events.getTransferLogs(options?);
kwr.events.decodeLog({ topics, data });
const unwatch = kwr.events.watchReceipt(handler);
const unwatch = kwr.events.watchRefundClaimed(handler);
const unwatch = kwr.events.watchWithdrawalWithFeeSuccessful(handler);
const unwatch = kwr.events.watchFeesDisbursed(handler);
```

### ItemRegistry

```typescript
const ir = oak.itemRegistry("0x...");

await ir.events.getItemAddedLogs(options?);
ir.events.decodeLog({ topics, data });
const unwatch = ir.events.watchItemAdded(handler);
```

## Types

All event methods use shared types from `@oaknetwork/contracts-sdk`:

```typescript
import type {
  DecodedEventLog,
  EventFilterOptions,
  EventWatchHandler,
  RawLog,
} from '@oaknetwork/contracts-sdk';
```

| Type | Description |
|---|---|
| `EventFilterOptions` | Optional `{ fromBlock?: bigint; toBlock?: bigint }` for `get*Logs` methods. Defaults to genesis → latest. |
| `DecodedEventLog` | Returned by `get*Logs` and `decodeLog`. Contains `eventName` and typed `args`. |
| `RawLog` | Input to `decodeLog`. Contains `topics` and `data` from a transaction receipt. |
| `EventWatchHandler` | Callback for `watch*` methods: `(logs: readonly DecodedEventLog[]) => void`. |
