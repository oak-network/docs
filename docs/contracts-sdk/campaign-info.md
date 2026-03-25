---
sidebar_label: CampaignInfo
---

# CampaignInfo

Per-campaign configuration and state. Each campaign deployed via the CampaignInfoFactory gets its own CampaignInfo contract that tracks funding progress, accepted tokens, platform settings, and NFT pledge records.

```typescript
const ci = oak.campaignInfo('0x...campaignAddress');
```

## Methods

### Reads

| Method | Returns | Description |
|---|---|---|
| `getLaunchTime()` | `bigint` | Campaign launch timestamp (seconds) |
| `getDeadline()` | `bigint` | Campaign deadline timestamp (seconds) |
| `getGoalAmount()` | `bigint` | Funding goal in currency units |
| `getCampaignCurrency()` | `Hex` | bytes32 currency identifier |
| `getIdentifierHash()` | `Hex` | Campaign identifier hash |
| `checkIfPlatformSelected(platformBytes)` | `boolean` | Whether a platform is selected |
| `checkIfPlatformApproved(platformHash)` | `boolean` | Whether a platform is approved |
| `getPlatformAdminAddress(platformBytes)` | `Address` | Platform admin address |
| `getPlatformData(platformDataKey)` | `Hex` | Platform-specific data value |
| `getPlatformFeePercent(platformBytes)` | `bigint` | Platform fee in basis points |
| `getPlatformClaimDelay(platformHash)` | `bigint` | Platform claim delay in seconds |
| `getProtocolAdminAddress()` | `Address` | Protocol admin address |
| `getProtocolFeePercent()` | `bigint` | Protocol fee in basis points |
| `getAcceptedTokens()` | `Address[]` | List of accepted ERC-20 token addresses |
| `isTokenAccepted(token)` | `boolean` | Whether a token is accepted |
| `getTotalRaisedAmount()` | `bigint` | Current raised amount |
| `getTotalLifetimeRaisedAmount()` | `bigint` | Total ever raised (including refunded) |
| `getTotalRefundedAmount()` | `bigint` | Total refunded amount |
| `getTotalAvailableRaisedAmount()` | `bigint` | Available raised (raised minus refunded) |
| `getTotalCancelledAmount()` | `bigint` | Total cancelled amount |
| `getTotalExpectedAmount()` | `bigint` | Total expected pending amount |
| `getDataFromRegistry(key)` | `Hex` | Registry data value |
| `getBufferTime()` | `bigint` | Buffer time in seconds |
| `getLineItemType(platformHash, typeId)` | `LineItemTypeInfo` | Line item type configuration |
| `getCampaignConfig()` | `CampaignConfig` | Full campaign configuration |
| `getApprovedPlatformHashes()` | `Hex[]` | List of approved platform hashes |
| `isLocked()` | `boolean` | Whether the campaign is locked |
| `cancelled()` | `boolean` | Whether the campaign is cancelled |
| `owner()` | `Address` | Contract owner |
| `paused()` | `boolean` | Whether the campaign is paused |

### Writes

All write methods return `Promise<Hex>` (transaction hash).

| Method | Description |
|---|---|
| `updateDeadline(deadline)` | Update campaign deadline |
| `updateGoalAmount(goalAmount)` | Update funding goal |
| `updateLaunchTime(launchTime)` | Update launch time |
| `updateSelectedPlatform(platformHash, selection, platformDataKey, platformDataValue)` | Add or remove a platform |
| `setImageURI(newImageURI)` | Update NFT image URI |
| `updateContractURI(newContractURI)` | Update contract metadata URI |
| `mintNFTForPledge(backer, reward, tokenAddress, amount, shippingFee, tipAmount)` | Mint a pledge NFT for a backer |
| `burn(tokenId)` | Burn a pledge NFT |
| `pauseCampaign(message)` | Pause the campaign |
| `unpauseCampaign(message)` | Unpause the campaign |
| `cancelCampaign(message)` | Cancel the campaign |
| `setPlatformInfo(platformBytes, platformTreasuryAddress)` | Set platform treasury address |
| `transferOwnership(newOwner)` | Transfer contract ownership |
| `renounceOwnership()` | Renounce contract ownership |

## Usage examples

### Read campaign state

```typescript
const launchTime  = await ci.getLaunchTime();
const deadline    = await ci.getDeadline();
const goal        = await ci.getGoalAmount();
const raised      = await ci.getTotalRaisedAmount();
const currency    = await ci.getCampaignCurrency();
const isCancelled = await ci.cancelled();

console.log('Goal:', goal, '| Raised:', raised);
console.log('Currency:', currency);
console.log('Cancelled:', isCancelled);
```

### Get full campaign configuration

```typescript
const config = await ci.getCampaignConfig();

console.log('Treasury factory:', config.treasuryFactory);
console.log('Protocol fee:', config.protocolFeePercent, 'bps');
console.log('Identifier:', config.identifierHash);
```

### Update campaign deadline

```typescript
import { addDays, getCurrentTimestamp } from '@oaknetwork/contracts';

const newDeadline = addDays(getCurrentTimestamp(), 60);
const txHash = await ci.updateDeadline(newDeadline);
await oak.waitForReceipt(txHash);
```

### Pause and cancel

```typescript
import { toHex } from '@oaknetwork/contracts';

// Pause
const pauseTx = await ci.pauseCampaign(toHex('Maintenance window', { size: 32 }));
await oak.waitForReceipt(pauseTx);

// Unpause
const unpauseTx = await ci.unpauseCampaign(toHex('Maintenance complete', { size: 32 }));
await oak.waitForReceipt(unpauseTx);

// Cancel
const cancelTx = await ci.cancelCampaign(toHex('Campaign ended early', { size: 32 }));
await oak.waitForReceipt(cancelTx);
```

### Check accepted tokens

```typescript
const tokens = await ci.getAcceptedTokens();
console.log('Accepted tokens:', tokens);

const isAccepted = await ci.isTokenAccepted('0x...tokenAddress');
console.log('Token accepted:', isAccepted);
```

## Related

- [CampaignInfoFactory](/docs/contracts-sdk/campaign-info-factory) — deploy new campaigns
- [PaymentTreasury](/docs/contracts-sdk/payment-treasury) — fiat payment treasury for campaigns
- [AllOrNothing](/docs/contracts-sdk/all-or-nothing) — all-or-nothing crowdfunding treasury
- [KeepWhatsRaised](/docs/contracts-sdk/keep-whats-raised) — keep-what's-raised crowdfunding treasury
