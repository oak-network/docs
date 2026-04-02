---
sidebar_label: TreasuryFactory
---

# TreasuryFactory

Deploys treasury contracts for a given CampaignInfo. Manages treasury implementations that platforms can register, approve, and deploy.

```typescript
const tf = oak.treasuryFactory('0x...contractAddress');
```

## Methods

### Writes

All write methods return `Promise<Hex>` (transaction hash).

| Method | Description |
|---|---|
| `deploy(platformHash, infoAddress, implementationId)` | Deploy a treasury for a campaign |
| `registerTreasuryImplementation(platformHash, implementationId, implementation)` | Register a new treasury implementation |
| `approveTreasuryImplementation(platformHash, implementationId)` | Approve a registered implementation |
| `disapproveTreasuryImplementation(implementation)` | Disapprove an implementation |
| `removeTreasuryImplementation(platformHash, implementationId)` | Remove an implementation |

## Usage examples

### Deploy a treasury

```typescript
import { keccak256, toHex } from '@oaknetwork/contracts-sdk';

const PLATFORM_HASH = keccak256(toHex('my-platform'));
const campaignInfoAddress = '0x...';
const implementationId = 1n; // ID of the approved implementation

const txHash = await tf.deploy(PLATFORM_HASH, campaignInfoAddress, implementationId);
const receipt = await oak.waitForReceipt(txHash);
console.log('Treasury deployed in block:', receipt.blockNumber);
```

### Register and approve an implementation

```typescript
// Register
const regTx = await tf.registerTreasuryImplementation(
  PLATFORM_HASH,
  1n,                      // implementationId
  '0x...implAddress',      // implementation contract address
);
await oak.waitForReceipt(regTx);

// Approve
const approveTx = await tf.approveTreasuryImplementation(PLATFORM_HASH, 1n);
await oak.waitForReceipt(approveTx);
```

### Remove an implementation

```typescript
const txHash = await tf.removeTreasuryImplementation(PLATFORM_HASH, 1n);
await oak.waitForReceipt(txHash);
```

## Simulation

```typescript
try {
  await tf.simulate.deploy(PLATFORM_HASH, campaignInfoAddress, 1n);
  const txHash = await tf.deploy(PLATFORM_HASH, campaignInfoAddress, 1n);
} catch (err) {
  console.error('Would revert:', err.name);
}
```

## Related

- [CampaignInfo](/docs/contracts-sdk/campaign-info) — the campaign that the treasury serves
- [PaymentTreasury](/docs/contracts-sdk/payment-treasury) — fiat payment treasury type
- [AllOrNothing](/docs/contracts-sdk/all-or-nothing) — all-or-nothing crowdfunding treasury type
- [KeepWhatsRaised](/docs/contracts-sdk/keep-whats-raised) — keep-what's-raised treasury type
