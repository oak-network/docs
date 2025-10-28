# ItemRegistry

The `ItemRegistry` contract provides functionality for managing reward items in campaigns. It tracks item details like weight, dimensions, category, and value for physical and digital rewards.

## Overview

```solidity
contract ItemRegistry is IItem, Context {
    mapping(address => mapping(bytes32 => Item)) private Items;
    
    event ItemAdded(address indexed owner, bytes32 indexed itemId, Item item);
    error ItemRegistryMismatchedArraysLength();
}
```

## Purpose

- **Item Management**: Register and track reward items
- **Inventory Tracking**: Maintain item details for rewards
- **Value Calculation**: Track item values for reward fulfillment
- **Owner-Based**: Items tracked by owner address
- **Batch Support**: Add multiple items at once

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `Items` | `mapping(address => mapping(bytes32 => Item))` | Items registry by owner and item ID |

## Functions

### Get Item

```solidity
function getItem(address owner, bytes32 itemId) 
    external 
    view 
    override 
    returns (Item memory);
```

**Parameters:**
- `owner`: Item owner address
- `itemId`: Unique item identifier

**Returns:**
- Complete Item structure with all attributes

**Usage:**
- Query item details before fulfillment
- Check item specifications
- Verify item availability

### Add Item

```solidity
function addItem(bytes32 itemId, Item calldata item) external override;
```

**Parameters:**
- `itemId`: Unique item identifier
- `item`: Item structure with details

**Effects:**
- Stores item in registry
- Associates with caller as owner
- Emits `ItemAdded` event

**Requirements:**
- Item ID must be unique for caller
- Item details must be valid

### Add Items Batch

```solidity
function addItemsBatch(
    bytes32[] calldata itemIds,
    Item[] calldata items
) external;
```

**Parameters:**
- `itemIds`: Array of item identifiers
- `items`: Array of item structures

**Effects:**
- Adds multiple items in single transaction
- More gas efficient for multiple items
- Emits events for each item

**Requirements:**
- Arrays must have matching lengths
- Each item must have unique ID

## Item Structure

```solidity
struct Item {
    uint256 actualWeight;       // Actual weight of item
    bytes32 dimensions;          // Physical dimensions
    bytes32 category;            // Item category
    uint256 declaredCurrency;    // Currency value
}
```

## Events

### ItemAdded

```solidity
event ItemAdded(address indexed owner, bytes32 indexed itemId, Item item);
```

**Emitted when:** New item is registered
**Includes:** Owner address, item ID, and full item details

## Errors

### ItemRegistryMismatchedArraysLength

```solidity
error ItemRegistryMismatchedArraysLength();
```

**Thrown when:** Arrays in batch operations have different lengths

## Usage Examples

### Registering Items

```javascript
// Add single item
const itemId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('product-v1'));
const item = {
  actualWeight: 500, // grams
  dimensions: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('10x10x5')),
  category: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('hardware')),
  declaredCurrency: ethers.utils.parseEther('50')
};

await itemRegistry.addItem(itemId, item);
```

### Batch Registration

```javascript
// Add multiple items
const itemIds = [
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes('product-v1')),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes('product-v2')),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes('t-shirt'))
];

const items = [
  {
    actualWeight: 500,
    dimensions: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('10x10x5')),
    category: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('hardware')),
    declaredCurrency: ethers.utils.parseEther('50')
  },
  {
    actualWeight: 800,
    dimensions: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('15x15x7')),
    category: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('hardware')),
    declaredCurrency: ethers.utils.parseEther('80')
  },
  {
    actualWeight: 150,
    dimensions: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('shirt-size-l')),
    category: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('merchandise')),
    declaredCurrency: ethers.utils.parseEther('15')
  }
];

await itemRegistry.addItemsBatch(itemIds, items);
```

### Querying Items

```javascript
// Get item details
const owner = campaignOwnerAddress;
const itemId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('product-v1'));

const item = await itemRegistry.getItem(owner, itemId);
console.log('Weight:', item.actualWeight, 'g');
console.log('Value:', ethers.utils.formatEther(item.declaredCurrency));
```

## Integration

### With Rewards

```javascript
// Use items in rewards
const reward = {
  rewardValue: ethers.utils.parseEther('50'),
  isRewardTier: true,
  itemId: [
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('product-v1'))
  ],
  itemValue: [
    ethers.utils.parseEther('40')
  ],
  itemQuantity: [1]
};

// Add items to registry first
await itemRegistry.addItem(reward.itemId[0], itemDetails);

// Then add reward
await treasury.addRewards([rewardName], [reward]);
```

### Item Fulfillment

```javascript
// Get items for reward fulfillment
const reward = await treasury.getReward(rewardName);

for (const itemId of reward.itemId) {
  const item = await itemRegistry.getItem(campaignOwner, itemId);
  
  // Log item details for shipping
  console.log('Item:', itemId);
  console.log('Weight:', item.actualWeight, 'g');
  console.log('Dimensions:', ethers.utils.toUtf8String(item.dimensions));
}
```

## Best Practices

### Organize Items by Category

```javascript
// Group items logically
const hardwareItems = [
  'product-v1',
  'product-v2',
  'accessory'
];

const merchandiseItems = [
  't-shirt',
  'sticker',
  'poster'
];

// Register by category
await registerCategoryItems('hardware', hardwareItems);
await registerCategoryItems('merchandise', merchandiseItems);
```

### Track Item Values

```javascript
// Update item values consistently
const items = [
  { id: 'product', value: parseEther('50') },
  { id: 't-shirt', value: parseEther('15') }
];

await itemRegistry.addItemsBatch(
  items.map(i => i.id),
  items.map(i => ({ 
    actualWeight: 0,
    dimensions: ethers.utils.formatBytes32String(''),
    category: ethers.utils.formatBytes32String(''),
    declaredCurrency: i.value
  }))
);
```

## Next Steps

- [FiatEnabled](./fiat-enabled.md) - Fiat transaction tracking
- [Interfaces](./interfaces.md) - IItem interface reference


