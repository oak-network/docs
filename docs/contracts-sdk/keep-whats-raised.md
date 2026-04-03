---
sidebar_label: KeepWhatsRaised
---

# KeepWhatsRaised Treasury

Crowdfunding treasury where the creator keeps all funds raised regardless of whether the goal is met. Includes configurable fee structures, withdrawal delays, and ERC-721 pledge NFTs.

```typescript
const kwr = oak.keepWhatsRaisedTreasury('0x...contractAddress');
```

## Methods

### Reads

| Method | Returns | Description |
|---|---|---|
| `getRaisedAmount()` | `bigint` | Current raised amount |
| `getLifetimeRaisedAmount()` | `bigint` | Total ever raised |
| `getRefundedAmount()` | `bigint` | Total refunded amount |
| `getAvailableRaisedAmount()` | `bigint` | Available raised (raised minus refunded) |
| `getReward(rewardName)` | `TieredReward` | Reward details by name |
| `getPlatformHash()` | `Hex` | Platform hash |
| `getPlatformFeePercent()` | `bigint` | Platform fee in basis points |
| `getWithdrawalApprovalStatus()` | `boolean` | Whether withdrawal is approved |
| `getLaunchTime()` | `bigint` | Campaign launch timestamp |
| `getDeadline()` | `bigint` | Campaign deadline timestamp |
| `getGoalAmount()` | `bigint` | Funding goal amount |
| `getPaymentGatewayFee(pledgeId)` | `bigint` | Payment gateway fee for a pledge |
| `getFeeValue(feeKey)` | `bigint` | Fee value for a registry key |
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
| `isApprovedForAll(owner, operator)` | `boolean` | Whether operator is approved for all |
| `supportsInterface(interfaceId)` | `boolean` | ERC-165 interface check |

### Writes

All write methods return `Promise<Hex>` (transaction hash).

**Treasury management:**

| Method | Description |
|---|---|
| `configureTreasury(config, campaignData, feeKeys, feeValues)` | Configure the treasury |
| `pauseTreasury(message)` | Pause the treasury |
| `unpauseTreasury(message)` | Unpause the treasury |
| `cancelTreasury(message)` | Cancel the treasury |
| `updateDeadline(deadline)` | Update campaign deadline |
| `updateGoalAmount(goalAmount)` | Update funding goal |

**Rewards and pledges:**

| Method | Description |
|---|---|
| `addRewards(rewardNames, rewards)` | Register reward tiers |
| `removeReward(rewardName)` | Remove a reward tier |
| `pledgeForAReward(pledgeId, backer, pledgeToken, tip, rewardNames)` | Pledge with reward selection and optional tip |
| `pledgeWithoutAReward(pledgeId, backer, pledgeToken, pledgeAmount, tip)` | Pledge without a reward |
| `setFeeAndPledge(pledgeId, backer, pledgeToken, pledgeAmount, tip, fee, reward, isPledgeForAReward)` | Set fee and pledge in one call |
| `setPaymentGatewayFee(pledgeId, fee)` | Set payment gateway fee |

**Funds:**

| Method | Description |
|---|---|
| `approveWithdrawal()` | Approve fund withdrawal |
| `claimFund()` | Claim raised funds |
| `claimTip()` | Claim accumulated tips |
| `claimRefund(tokenId)` | Claim a refund using a pledge NFT |
| `disburseFees()` | Disburse accumulated fees |
| `withdraw(token, amount)` | Withdraw a specific token amount |

**ERC-721:**

| Method | Description |
|---|---|
| `approve(to, tokenId)` | Approve an operator for a token |
| `setApprovalForAll(operator, approved)` | Approve/revoke operator for all |
| `safeTransferFrom(from, to, tokenId)` | Transfer a pledge NFT |
| `transferFrom(from, to, tokenId)` | Transfer a pledge NFT (unsafe) |

## Configuration types

### KeepWhatsRaisedConfig

```typescript
interface KeepWhatsRaisedConfig {
  minimumWithdrawalForFeeExemption: bigint; // min amount exempt from withdrawal fee
  withdrawalDelay: bigint;                   // seconds between approval and withdrawal
  refundDelay: bigint;                       // seconds before backers can claim refunds
  configLockPeriod: bigint;                  // seconds config is locked after setting
  isColombianCreator: boolean;               // Colombian creator tax treatment
}
```

### KeepWhatsRaisedFeeKeys / FeeValues

```typescript
interface KeepWhatsRaisedFeeKeys {
  flatFeeKey: Hex;                          // registry key for flat withdrawal fee
  cumulativeFlatFeeKey: Hex;                // registry key for cumulative flat fee cap
  grossPercentageFeeKeys: readonly Hex[];   // registry keys for percentage fees
}

interface KeepWhatsRaisedFeeValues {
  flatFeeValue: bigint;                     // flat fee amount
  cumulativeFlatFeeValue: bigint;           // cumulative flat fee cap
  grossPercentageFeeValues: readonly bigint[]; // percentage fee values
}
```

## Usage examples

### Configure the treasury

```typescript
import { toHex, getCurrentTimestamp, addDays } from '@oaknetwork/contracts-sdk';

const now = getCurrentTimestamp();

const txHash = await kwr.configureTreasury(
  {
    minimumWithdrawalForFeeExemption: 100_000n,
    withdrawalDelay: 86_400n,      // 1 day
    refundDelay: 604_800n,         // 7 days
    configLockPeriod: 259_200n,    // 3 days
    isColombianCreator: false,
  },
  {
    launchTime: now + 3_600n,
    deadline:   addDays(now, 30),
    goalAmount: 1_000_000n,
    currency:   toHex('USD', { size: 32 }),
  },
  {
    flatFeeKey: keccak256(toHex('flatFee')),
    cumulativeFlatFeeKey: keccak256(toHex('cumFlatFee')),
    grossPercentageFeeKeys: [keccak256(toHex('percentFee'))],
  },
  {
    flatFeeValue: 1_000n,
    cumulativeFlatFeeValue: 10_000n,
    grossPercentageFeeValues: [500n], // 5%
  },
);
await oak.waitForReceipt(txHash);
```

### Pledge with a reward

```typescript
import { keccak256, toHex } from '@oaknetwork/contracts-sdk';

const pledgeId   = keccak256(toHex('pledge-001'));
const rewardName = keccak256(toHex('gold-tier'));

const txHash = await kwr.pledgeForAReward(
  pledgeId,
  '0x...backerAddress',
  '0x...tokenAddress',
  5_000n,          // tip
  [rewardName],
);
await oak.waitForReceipt(txHash);
```

### Withdraw funds

```typescript
// Step 1: Approve withdrawal
const approveTx = await kwr.approveWithdrawal();
await oak.waitForReceipt(approveTx);

// Step 2: Wait for withdrawal delay, then claim
const claimTx = await kwr.claimFund();
await oak.waitForReceipt(claimTx);

// Claim tips separately
const tipTx = await kwr.claimTip();
await oak.waitForReceipt(tipTx);
```

### Disburse and withdraw specific tokens

```typescript
const disburseTx = await kwr.disburseFees();
await oak.waitForReceipt(disburseTx);

const withdrawTx = await kwr.withdraw('0x...tokenAddress', 50_000n);
await oak.waitForReceipt(withdrawTx);
```

## Related

- [AllOrNothing](/docs/contracts-sdk/all-or-nothing) — alternative treasury where funds are only released if goal is met
- [CampaignInfo](/docs/contracts-sdk/campaign-info) — campaign this treasury serves
- [TreasuryFactory](/docs/contracts-sdk/treasury-factory) — deploying treasury contracts
