---
sidebar_label: GlobalParams
---

# GlobalParams

Protocol-wide configuration registry. Manages platform listings, fee settings, token currencies, line item types, and a general-purpose key-value registry.

```typescript
import { createOakContractsClient, CHAIN_IDS } from '@oaknetwork/contracts';

const oak = createOakContractsClient({ ... });
const gp = oak.globalParams('0x...contractAddress');
```

## Methods

### Reads

| Method | Returns | Description |
|---|---|---|
| `getProtocolAdminAddress()` | `Address` | Protocol admin wallet |
| `getProtocolFeePercent()` | `bigint` | Protocol fee in basis points |
| `getNumberOfListedPlatforms()` | `bigint` | Total listed platform count |
| `checkIfPlatformIsListed(platformBytes)` | `boolean` | Whether a platform is listed |
| `checkIfPlatformDataKeyValid(platformDataKey)` | `boolean` | Whether a platform data key is valid |
| `getPlatformAdminAddress(platformBytes)` | `Address` | Admin address for a platform |
| `getPlatformFeePercent(platformBytes)` | `bigint` | Platform fee in basis points |
| `getPlatformClaimDelay(platformBytes)` | `bigint` | Claim delay in seconds |
| `getPlatformAdapter(platformBytes)` | `Address` | Platform adapter contract |
| `getPlatformDataOwner(platformDataKey)` | `Hex` | Owner of a platform data key |
| `getPlatformLineItemType(platformHash, typeId)` | `LineItemTypeInfo` | Line item type configuration |
| `getTokensForCurrency(currency)` | `Address[]` | Accepted tokens for a currency |
| `getFromRegistry(key)` | `Hex` | Value from the key-value registry |
| `owner()` | `Address` | Contract owner |

### Writes

All write methods return `Promise<Hex>` (transaction hash).

| Method | Description |
|---|---|
| `enlistPlatform(platformHash, adminAddress, feePercent, adapterAddress)` | Register a new platform |
| `delistPlatform(platformBytes)` | Remove a platform |
| `updatePlatformAdminAddress(platformBytes, adminAddress)` | Change platform admin |
| `updatePlatformClaimDelay(platformBytes, claimDelay)` | Update claim delay |
| `updateProtocolAdminAddress(adminAddress)` | Change protocol admin |
| `updateProtocolFeePercent(feePercent)` | Update protocol fee |
| `setPlatformAdapter(platformBytes, adapterAddress)` | Set platform adapter contract |
| `setPlatformLineItemType(platformHash, typeId, label, countsTowardGoal, applyProtocolFee, canRefund, instantTransfer)` | Register a line item type |
| `removePlatformLineItemType(platformHash, typeId)` | Remove a line item type |
| `addTokenToCurrency(currency, token)` | Add an accepted token for a currency |
| `removeTokenFromCurrency(currency, token)` | Remove a token from a currency |
| `addPlatformData(platformBytes, platformDataKey)` | Add a platform data key |
| `removePlatformData(platformBytes, platformDataKey)` | Remove a platform data key |
| `addToRegistry(key, value)` | Set a key-value pair in the registry |
| `transferOwnership(newOwner)` | Transfer contract ownership |
| `renounceOwnership()` | Renounce contract ownership |

## Usage examples

### Read protocol configuration

```typescript
const admin = await gp.getProtocolAdminAddress();
const fee   = await gp.getProtocolFeePercent();

console.log('Admin:', admin);
console.log('Fee:', fee, 'bps'); // 100n = 1%
```

### Enlist a platform

```typescript
import { keccak256, toHex } from '@oaknetwork/contracts';

const PLATFORM_HASH = keccak256(toHex('my-platform'));

const txHash = await gp.enlistPlatform(
  PLATFORM_HASH,
  '0x...adminAddress',
  200n,                  // 2% fee
  '0x...adapterAddress',
);

const receipt = await oak.waitForReceipt(txHash);
console.log('Platform enlisted in block:', receipt.blockNumber);
```

### Configure line item types

```typescript
const typeId = keccak256(toHex('product-sale'));

const txHash = await gp.setPlatformLineItemType(
  PLATFORM_HASH,
  typeId,
  'Product Sale',   // label
  true,             // countsTowardGoal
  true,             // applyProtocolFee
  true,             // canRefund
  false,            // instantTransfer
);

await oak.waitForReceipt(txHash);

// Verify
const info = await gp.getPlatformLineItemType(PLATFORM_HASH, typeId);
console.log(info.label);            // "Product Sale"
console.log(info.countsTowardGoal); // true
```

### Query accepted tokens

```typescript
const CURRENCY = toHex('USD', { size: 32 });

const tokens = await gp.getTokensForCurrency(CURRENCY);
console.log('Accepted USD tokens:', tokens);
```

## Simulation

Use `simulate` to dry-run write operations before sending a transaction. Simulations throw typed errors on revert without spending gas.

```typescript
try {
  await gp.simulate.enlistPlatform(PLATFORM_HASH, admin, fee, adapter);
  // Safe to send the real transaction
  const txHash = await gp.enlistPlatform(PLATFORM_HASH, admin, fee, adapter);
} catch (err) {
  console.error('Would revert:', err.name, err.recoveryHint);
}
```

## Related

- [CampaignInfoFactory](/docs/contracts-sdk/campaign-info-factory) — uses GlobalParams for campaign creation
- [Utilities](/docs/contracts-sdk/utilities) — `keccak256`, `toHex`, and other encoding helpers
- [Error Handling](/docs/contracts-sdk/error-handling) — decoding `GlobalParams*` revert errors
