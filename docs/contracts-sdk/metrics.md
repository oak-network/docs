# Metrics

Pre-built aggregation functions that combine multiple on-chain reads into meaningful reports. Import from `@oaknetwork/contracts-sdk/metrics`.

:::info Entry point
Metrics helpers are exported from `@oaknetwork/contracts-sdk/metrics` only — they are **not** re-exported from the root `@oaknetwork/contracts-sdk` barrel.
:::

## Platform Stats

Protocol-level statistics from GlobalParams:

```typescript
import { getPlatformStats } from '@oaknetwork/contracts-sdk/metrics';

const stats = await getPlatformStats({
  globalParamsAddress: '0x...',
  publicClient: oak.publicClient,
});

console.log(`${stats.platformCount} platforms enlisted`);
console.log(`Protocol fee: ${stats.protocolFeePercent} bps`);
```

### Return shape

| Field | Type | Description |
|---|---|---|
| `platformCount` | `bigint` | Number of platforms currently enlisted |
| `protocolFeePercent` | `bigint` | Protocol fee in basis points (100 = 1%) |

## Campaign Summary

Financial aggregation from a deployed CampaignInfo contract:

```typescript
import { getCampaignSummary } from '@oaknetwork/contracts-sdk/metrics';

const summary = await getCampaignSummary({
  campaignInfoAddress: '0x...',
  publicClient: oak.publicClient,
});

console.log(`Total raised: ${summary.totalRaised}`);
console.log(`Goal: ${summary.goalAmount}`);
console.log(`Goal reached: ${summary.goalReached}`);
console.log(`Refunded: ${summary.totalRefunded}`);
```

### Return shape

| Field | Type | Description |
|---|---|---|
| `totalRaised` | `bigint` | Total amount raised across all treasuries |
| `goalAmount` | `bigint` | Campaign funding goal |
| `goalReached` | `boolean` | Whether `totalRaised >= goalAmount` |
| `totalRefunded` | `bigint` | Total amount refunded to backers |

## Treasury Report

Per-treasury financial report for any treasury type:

```typescript
import { getTreasuryReport } from '@oaknetwork/contracts-sdk/metrics';

const report = await getTreasuryReport({
  treasuryAddress: '0x...',
  treasuryType: 'all-or-nothing', // or "keep-whats-raised" | "payment-treasury"
  publicClient: oak.publicClient,
});

console.log(`Raised: ${report.raisedAmount}`);
console.log(`Refunded: ${report.refundedAmount}`);
console.log(`Fee: ${report.platformFeePercent} bps`);
console.log(`Cancelled: ${report.cancelled}`);
```

### Return shape

| Field | Type | Description |
|---|---|---|
| `raisedAmount` | `bigint` | Total raised by this treasury |
| `refundedAmount` | `bigint` | Total refunded from this treasury |
| `platformFeePercent` | `bigint` | Platform fee in basis points |
| `cancelled` | `boolean` | Whether the treasury has been cancelled |

### Supported treasury types

| `treasuryType` value | Contract |
|---|---|
| `"all-or-nothing"` | AllOrNothing treasury |
| `"keep-whats-raised"` | KeepWhatsRaised treasury |
| `"payment-treasury"` | PaymentTreasury / TimeConstrainedPaymentTreasury |
