---
sidebar_label: AllOrNothing
---

# AllOrNothing Treasury

Crowdfunding treasury where funds are only released if the campaign goal is met. If the goal is not reached, backers can claim full refunds. Includes ERC-721 pledge NFTs.

```typescript
const aon = oak.allOrNothingTreasury('0x...contractAddress');
```

## Methods

### Reads

| Method | Returns | Description |
|---|---|---|
| `getRaisedAmount()` | `bigint` | Current raised amount |
| `getLifetimeRaisedAmount()` | `bigint` | Total ever raised |
| `getRefundedAmount()` | `bigint` | Total refunded amount |
| `getReward(rewardName)` | `TieredReward` | Reward details by name |
| `getPlatformHash()` | `Hex` | Platform hash |
| `getPlatformFeePercent()` | `bigint` | Platform fee in basis points |
| `paused()` | `boolean` | Whether the treasury is paused |
| `cancelled()` | `boolean` | Whether the treasury is cancelled |

**ERC-721 reads:**

| Method | Returns | Description |
|---|---|---|
| `balanceOf(owner)` | `bigint` | NFT balance of an address |
| `ownerOf(tokenId)` | `Address` | Owner of a pledge NFT |
| `tokenURI(tokenId)` | `string` | Metadata URI for a pledge NFT |
| `name()` | `string` | NFT collection name |
| `symbol()` | `string` | NFT collection symbol |
| `getApproved(tokenId)` | `Address` | Approved operator for a token |
| `isApprovedForAll(owner, operator)` | `boolean` | Whether operator is approved for all tokens |
| `supportsInterface(interfaceId)` | `boolean` | ERC-165 interface check |

### Writes

All write methods return `Promise<Hex>` (transaction hash).

| Method | Description |
|---|---|
| `addRewards(rewardNames, rewards)` | Register reward tiers |
| `removeReward(rewardName)` | Remove a reward tier |
| `pledgeForAReward(backer, pledgeToken, shippingFee, rewardNames)` | Pledge with reward selection |
| `pledgeWithoutAReward(backer, pledgeToken, pledgeAmount)` | Pledge without selecting a reward |
| `claimRefund(tokenId)` | Claim a refund using a pledge NFT |
| `disburseFees()` | Disburse accumulated fees |
| `withdraw()` | Withdraw funds (only if goal is met) |
| `burn(tokenId)` | Burn a pledge NFT |
| `pauseTreasury(message)` | Pause the treasury |
| `unpauseTreasury(message)` | Unpause the treasury |
| `cancelTreasury(message)` | Cancel the treasury |

**ERC-721 writes:**

| Method | Description |
|---|---|
| `approve(to, tokenId)` | Approve an operator for a token |
| `setApprovalForAll(operator, approved)` | Approve/revoke operator for all tokens |
| `safeTransferFrom(from, to, tokenId)` | Transfer a pledge NFT |
| `transferFrom(from, to, tokenId)` | Transfer a pledge NFT (unsafe) |

## TieredReward type

```typescript
interface TieredReward {
  rewardValue: bigint;          // minimum pledge for this tier
  isRewardTier: boolean;        // true for tiered, false for flat
  itemId: readonly Hex[];       // item IDs included
  itemValue: readonly bigint[]; // declared item values
  itemQuantity: readonly bigint[]; // item quantities
}
```

## Usage examples

### Add rewards and pledge

```typescript
import { keccak256, toHex } from '@oaknetwork/contracts-sdk';

const rewardName = keccak256(toHex('early-bird'));
const reward = {
  rewardValue: 50_000n,
  isRewardTier: true,
  itemId:       [keccak256(toHex('t-shirt'))],
  itemValue:    [25_000n],
  itemQuantity: [1n],
};

// Add rewards
const addTx = await aon.addRewards([rewardName], [reward]);
await oak.waitForReceipt(addTx);

// Pledge for a reward
const pledgeTx = await aon.pledgeForAReward(
  '0x...backerAddress',
  '0x...tokenAddress',
  5_000n,          // shipping fee
  [rewardName],
);
await oak.waitForReceipt(pledgeTx);
```

### Pledge without a reward

```typescript
const txHash = await aon.pledgeWithoutAReward(
  '0x...backerAddress',
  '0x...tokenAddress',
  100_000n, // pledge amount
);
await oak.waitForReceipt(txHash);
```

### Claim a refund

Backers can claim refunds if the goal is not met, using their pledge NFT token ID.

```typescript
const txHash = await aon.claimRefund(1n); // tokenId
await oak.waitForReceipt(txHash);
```

### Withdraw and disburse (goal met)

```typescript
const disburseTx = await aon.disburseFees();
await oak.waitForReceipt(disburseTx);

const withdrawTx = await aon.withdraw();
await oak.waitForReceipt(withdrawTx);
```

### Query pledge NFTs

```typescript
const owner = await aon.ownerOf(1n);
const uri   = await aon.tokenURI(1n);
const name  = await aon.name();

console.log('NFT owner:', owner);
console.log('Token URI:', uri);
console.log('Collection:', name);
```

## Related

- [KeepWhatsRaised](/docs/contracts-sdk/keep-whats-raised) — alternative treasury where creator keeps all funds
- [CampaignInfo](/docs/contracts-sdk/campaign-info) — campaign this treasury serves
- [TreasuryFactory](/docs/contracts-sdk/treasury-factory) — deploying treasury contracts
