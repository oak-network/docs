---
sidebar_label: CampaignInfoFactory
---

# CampaignInfoFactory

Deploys new CampaignInfo contracts. Each campaign gets its own on-chain CampaignInfo instance with its own address, NFT collection, and configuration.

```typescript
const factory = oak.campaignInfoFactory('0x...contractAddress');
```

## Methods

### Reads

| Method | Returns | Description |
|---|---|---|
| `identifierToCampaignInfo(identifierHash)` | `Address` | Get CampaignInfo address by identifier hash |
| `isValidCampaignInfo(campaignInfo)` | `boolean` | Check if an address is a valid CampaignInfo |
| `owner()` | `Address` | Contract owner |

### Writes

| Method | Returns | Description |
|---|---|---|
| `createCampaign(params)` | `Hex` | Deploy a new CampaignInfo contract |
| `updateImplementation(newImplementation)` | `Hex` | Update the CampaignInfo implementation address |
| `transferOwnership(newOwner)` | `Hex` | Transfer contract ownership |
| `renounceOwnership()` | `Hex` | Renounce contract ownership |

## CreateCampaignParams

The `createCampaign` method accepts a params object:

| Field | Type | Description |
|---|---|---|
| `creator` | `Address` | Address of the campaign creator |
| `identifierHash` | `Hex` | bytes32 unique campaign identifier hash |
| `selectedPlatformHash` | `Hex[]` | Platform hashes selected for this campaign |
| `platformDataKey` | `Hex[]` | Optional platform-specific data keys |
| `platformDataValue` | `Hex[]` | Optional platform-specific data values |
| `campaignData` | `CreateCampaignData` | On-chain campaign configuration |
| `nftName` | `string` | ERC-721 collection name for pledge NFTs |
| `nftSymbol` | `string` | ERC-721 collection symbol |
| `nftImageURI` | `string` | IPFS or HTTPS URI for the NFT image |
| `contractURI` | `string` | IPFS or HTTPS URI for ERC-721 contract metadata |

### CampaignData

| Field | Type | Description |
|---|---|---|
| `launchTime` | `bigint` | Unix timestamp (seconds) when the campaign launches |
| `deadline` | `bigint` | Unix timestamp (seconds) when the campaign ends |
| `goalAmount` | `bigint` | Minimum funding goal in currency units |
| `currency` | `Hex` | bytes32 currency identifier |

## Usage examples

### Create a campaign

```typescript
import {
  keccak256,
  toHex,
  getCurrentTimestamp,
  addDays,
} from '@oaknetwork/contracts-sdk';

const PLATFORM_HASH  = keccak256(toHex('my-platform'));
const CURRENCY       = toHex('USD', { size: 32 });
const identifierHash = keccak256(toHex('my-campaign-slug'));
const now            = getCurrentTimestamp();

const txHash = await factory.createCampaign({
  creator:              '0x...creatorAddress',
  identifierHash,
  selectedPlatformHash: [PLATFORM_HASH],
  campaignData: {
    launchTime: now + 3_600n,        // 1 hour from now
    deadline:   addDays(now, 30),    // 30 days from now
    goalAmount: 1_000_000n,
    currency:   CURRENCY,
  },
  nftName:     'My Campaign NFT',
  nftSymbol:   'MCN',
  nftImageURI: 'https://example.com/nft.png',
  contractURI: 'https://example.com/contract.json',
});

const receipt = await oak.waitForReceipt(txHash);
```

### Discover the deployed CampaignInfo address

After `createCampaign`, the factory emits a `CampaignCreated` event that carries the new `CampaignInfo` address. Two approaches are available — prefer the receipt-based one.

**Approach 1 — Decode the `CampaignCreated` event from the receipt (recommended).** Deterministic and works immediately regardless of RPC indexing lag.

```typescript
import { CAMPAIGN_INFO_FACTORY_EVENTS } from '@oaknetwork/contracts-sdk';

let campaignInfoAddress: `0x${string}` | undefined;

for (const log of receipt.logs) {
  try {
    const decoded = factory.events.decodeLog({
      topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
      data:   log.data   as `0x${string}`,
    });

    if (decoded.eventName === CAMPAIGN_INFO_FACTORY_EVENTS.CampaignCreated) {
      campaignInfoAddress = decoded.args?.campaignInfoAddress as `0x${string}`;
      break;
    }
  } catch {
    // Log belongs to a different contract — skip
  }
}

console.log('CampaignInfo (from receipt):', campaignInfoAddress);
```

**Approach 2 — Lookup via `identifierToCampaignInfo` (convenience).** Handy when you only have the identifier and did not keep the receipt. On some RPC providers the mapping may briefly return the zero address right after the transaction, so prefer Approach 1 when the receipt is available.

```typescript
const campaignAddress = await factory.identifierToCampaignInfo(identifierHash);
console.log('CampaignInfo (from lookup):', campaignAddress);
```

### Verify a campaign address

```typescript
const isValid = await factory.isValidCampaignInfo('0x...someAddress');
console.log('Is valid campaign:', isValid);
```

### Simulate before creating

```typescript
try {
  await factory.simulate.createCampaign(params);
  // Safe to proceed
  const txHash = await factory.createCampaign(params);
} catch (err) {
  console.error('Would revert:', err.name);
}
```

## Related

- [CampaignInfo](/docs/contracts-sdk/campaign-info) — interact with a deployed campaign
- [TreasuryFactory](/docs/contracts-sdk/treasury-factory) — deploy treasuries for a campaign
- [Utilities](/docs/contracts-sdk/utilities) — `keccak256`, `toHex`, `getCurrentTimestamp`, `addDays`
