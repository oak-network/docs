---
sidebar_label: ItemRegistry
---

# ItemRegistry

Manages items available for purchase in campaigns. Items represent physical goods with dimensions, weight, and category metadata.

```typescript
const ir = oak.itemRegistry('0x...contractAddress');
```

## Methods

### Reads

| Method | Returns | Description |
|---|---|---|
| `getItem(owner, itemId)` | `Item` | Get item details by owner and ID |

### Writes

All write methods return `Promise<Hex>` (transaction hash).

| Method | Description |
|---|---|
| `addItem(itemId, item)` | Register a single item |
| `addItemsBatch(itemIds, items)` | Register multiple items in one transaction |

## Item type

```typescript
interface Item {
  actualWeight: bigint;     // weight in grams
  height: bigint;           // height in millimetres
  width: bigint;            // width in millimetres
  length: bigint;           // length in millimetres
  category: Hex;            // bytes32 category identifier
  declaredCurrency: Hex;    // bytes32 currency identifier
}
```

## Usage examples

### Register an item

```typescript
import { keccak256, toHex } from '@oaknetwork/contracts';

const itemId = keccak256(toHex('premium-t-shirt'));

const txHash = await ir.addItem(itemId, {
  actualWeight:    250n,                              // 250g
  height:          50n,                               // 50mm
  width:           300n,                              // 300mm
  length:          400n,                              // 400mm
  category:        keccak256(toHex('apparel')),       // category
  declaredCurrency: toHex('USD', { size: 32 }),       // currency
});

await oak.waitForReceipt(txHash);
```

### Register items in batch

```typescript
const itemIds = [
  keccak256(toHex('item-1')),
  keccak256(toHex('item-2')),
];

const items = [
  {
    actualWeight: 250n,
    height: 50n, width: 300n, length: 400n,
    category: keccak256(toHex('apparel')),
    declaredCurrency: toHex('USD', { size: 32 }),
  },
  {
    actualWeight: 500n,
    height: 100n, width: 200n, length: 300n,
    category: keccak256(toHex('electronics')),
    declaredCurrency: toHex('USD', { size: 32 }),
  },
];

const txHash = await ir.addItemsBatch(itemIds, items);
await oak.waitForReceipt(txHash);
```

### Query an item

```typescript
const item = await ir.getItem('0x...ownerAddress', itemId);

console.log('Weight:', item.actualWeight, 'g');
console.log('Dimensions:', item.height, 'x', item.width, 'x', item.length, 'mm');
```

## Related

- [PaymentTreasury](/docs/contracts-sdk/payment-treasury) — uses item IDs in payment creation
- [AllOrNothing](/docs/contracts-sdk/all-or-nothing) — reward tiers reference item IDs
- [KeepWhatsRaised](/docs/contracts-sdk/keep-whats-raised) — reward tiers reference item IDs
