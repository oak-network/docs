# GlobalParams

The `GlobalParams` contract is the central configuration contract for the Oak Network protocol. It manages protocol-wide parameters, platform listings, fees, and administrative access control.

## Overview

```solidity
contract GlobalParams is IGlobalParams, Ownable {
    address private s_protocolAdminAddress;
    address private s_tokenAddress;
    uint256 private s_protocolFeePercent;
    mapping(bytes32 => bool) private s_platformIsListed;
    mapping(bytes32 => address) private s_platformAdminAddress;
    mapping(bytes32 => uint256) private s_platformFeePercent;
    mapping(bytes32 => bytes32) private s_platformDataOwner;
    mapping(bytes32 => bool) private s_platformData;
    Counters.Counter private s_numberOfListedPlatforms;
}
```

## Key Features

- **Protocol Administration**: Centralized protocol admin for emergency operations
- **Platform Management**: List, delist, and configure platforms
- **Fee Configuration**: Manage protocol and platform fees
- **Token Management**: Set default token address for campaigns
- **Platform Data**: Store platform-specific metadata
- **Access Control**: Role-based permissions for protocol and platform admins

## State Variables

### Protocol Configuration

| Variable | Type | Description |
|----------|------|-------------|
| `s_protocolAdminAddress` | `address` | Protocol administrator address |
| `s_tokenAddress` | `address` | Default campaign token address |
| `s_protocolFeePercent` | `uint256` | Protocol fee percentage |

### Platform Management

| Variable | Type | Description |
|----------|------|-------------|
| `s_platformIsListed` | `mapping(bytes32 => bool)` | Whether platform is listed |
| `s_platformAdminAddress` | `mapping(bytes32 => address)` | Platform admin address |
| `s_platformFeePercent` | `mapping(bytes32 => uint256)` | Platform fee percentage |
| `s_numberOfListedPlatforms` | `Counters.Counter` | Total number of listed platforms |

### Platform Data

| Variable | Type | Description |
|----------|------|-------------|
| `s_platformDataOwner` | `mapping(bytes32 => bytes32)` | Platform data ownership mapping |
| `s_platformData` | `mapping(bytes32 => bool)` | Platform data key mapping |

## Functions

### Platform Management

#### Enlist Platform

```solidity
function enlistPlatform(
    bytes32 platformHash,
    address platformAdminAddress,
    uint256 platformFeePercent
) external onlyOwner notAddressZero(platformAdminAddress);
```

**Parameters:**
- `platformHash`: Unique platform identifier
- `platformAdminAddress`: Platform administrator address
- `platformFeePercent`: Platform fee percentage

**Effects:**
- Lists the platform in the protocol
- Sets platform administrator
- Configures platform fee
- Emits `PlatformEnlisted` event

**Requirements:**
- Only callable by owner
- Platform must not already be listed
- Admin address must be non-zero

#### Delist Platform

```solidity
function delistPlatform(bytes32 platformHash) external onlyOwner;
```

**Parameters:**
- `platformHash`: Platform identifier to delist

**Effects:**
- Removes platform from listings
- Emits `PlatformDelisted` event

**Requirements:**
- Only callable by owner
- Platform must be listed

#### Check If Platform Is Listed

```solidity
function checkIfPlatformIsListed(bytes32 platformHash) external view override returns (bool);
```

**Parameters:**
- `platformHash`: Platform identifier

**Returns:**
- True if platform is listed

#### Get Number Of Listed Platforms

```solidity
function getNumberOfListedPlatforms() external view override returns (uint256);
```

**Returns:**
- Total number of listed platforms

### Protocol Configuration

#### Get Protocol Admin Address

```solidity
function getProtocolAdminAddress() external view override returns (address);
```

**Returns:**
- Protocol administrator address

#### Update Protocol Admin Address

```solidity
function updateProtocolAdminAddress(address newAdminAddress) external onlyOwner notAddressZero(newAdminAddress);
```

**Parameters:**
- `newAdminAddress`: New protocol admin address

**Effects:**
- Updates protocol admin
- Emits `ProtocolAdminAddressUpdated` event

**Requirements:**
- Only callable by owner
- Address must be non-zero

#### Get Token Address

```solidity
function getTokenAddress() external view override returns (address);
```

**Returns:**
- Default campaign token address

#### Update Token Address

```solidity
function updateTokenAddress(address newTokenAddress) external onlyOwner notAddressZero(newTokenAddress);
```

**Parameters:**
- `newTokenAddress`: New token address

**Effects:**
- Updates default token address
- Emits `TokenAddressUpdated` event

**Requirements:**
- Only callable by owner
- Address must be non-zero

#### Get Protocol Fee Percent

```solidity
function getProtocolFeePercent() external view override returns (uint256);
```

**Returns:**
- Protocol fee percentage

#### Update Protocol Fee Percent

```solidity
function updateProtocolFeePercent(uint256 newFeePercent) external onlyOwner;
```

**Parameters:**
- `newFeePercent`: New protocol fee percentage

**Effects:**
- Updates protocol fee
- Emits `ProtocolFeePercentUpdated` event

**Requirements:**
- Only callable by owner

### Platform Configuration

#### Get Platform Admin Address

```solidity
function getPlatformAdminAddress(bytes32 platformHash) external view override returns (address);
```

**Parameters:**
- `platformHash`: Platform identifier

**Returns:**
- Platform admin address

#### Update Platform Admin Address

```solidity
function updatePlatformAdminAddress(
    bytes32 platformHash,
    address newAdminAddress
) external onlyPlatformAdmin(platformHash) notAddressZero(newAdminAddress);
```

**Parameters:**
- `platformHash`: Platform identifier
- `newAdminAddress`: New admin address

**Effects:**
- Updates platform admin
- Emits `PlatformAdminAddressUpdated` event

**Requirements:**
- Only callable by platform admin
- Address must be non-zero

#### Get Platform Fee Percent

```solidity
function getPlatformFeePercent(bytes32 platformHash) external view override returns (uint256);
```

**Parameters:**
- `platformHash`: Platform identifier

**Returns:**
- Platform fee percentage

#### Update Platform Fee Percent

```solidity
function updatePlatformFeePercent(
    bytes32 platformHash,
    uint256 newFeePercent
) external onlyPlatformAdmin(platformHash);
```

**Parameters:**
- `platformHash`: Platform identifier
- `newFeePercent`: New platform fee percentage

**Effects:**
- Updates platform fee

**Requirements:**
- Only callable by platform admin

### Platform Data Management

#### Add Platform Data

```solidity
function addPlatformData(
    bytes32 platformHash,
    bytes32 platformDataKey
) external onlyPlatformAdmin(platformHash);
```

**Parameters:**
- `platformHash`: Platform identifier
- `platformDataKey`: Data key to add

**Effects:**
- Stores platform data key
- Emits `PlatformDataAdded` event

**Requirements:**
- Only callable by platform admin
- Data key must not already exist

#### Remove Platform Data

```solidity
function removePlatformData(bytes32 platformHash, bytes32 platformDataKey) external onlyPlatformAdmin(platformHash);
```

**Parameters:**
- `platformHash`: Platform identifier
- `platformDataKey`: Data key to remove

**Effects:**
- Removes platform data key
- Emits `PlatformDataRemoved` event

**Requirements:**
- Only callable by platform admin

#### Check Platform Data

```solidity
function checkPlatformData(bytes32 platformHash, bytes32 platformDataKey) external view returns (bool);
```

**Parameters:**
- `platformHash`: Platform identifier
- `platformDataKey`: Data key to check

**Returns:**
- True if data key exists

## Modifiers

### notAddressZero

```solidity
modifier notAddressZero(address account);
```

**Effect:** Reverts if address is zero

### onlyPlatformAdmin

```solidity
modifier onlyPlatformAdmin(bytes32 platformHash);
```

**Effect:** Restricts access to platform admin only

**Parameters:**
- `platformHash`: Platform identifier

## Events

### PlatformEnlisted

```solidity
event PlatformEnlisted(
    bytes32 indexed platformHash,
    address indexed platformAdminAddress,
    uint256 platformFeePercent
);
```

**Emitted when:** New platform is enlisted

### PlatformDelisted

```solidity
event PlatformDelisted(bytes32 indexed platformHash);
```

**Emitted when:** Platform is delisted

### ProtocolAdminAddressUpdated

```solidity
event ProtocolAdminAddressUpdated(address indexed newAdminAddress);
```

**Emitted when:** Protocol admin address changes

### TokenAddressUpdated

```solidity
event TokenAddressUpdated(address indexed newTokenAddress);
```

**Emitted when:** Default token address changes

### ProtocolFeePercentUpdated

```solidity
event ProtocolFeePercentUpdated(uint256 newFeePercent);
```

**Emitted when:** Protocol fee percentage changes

### PlatformAdminAddressUpdated

```solidity
event PlatformAdminAddressUpdated(
    bytes32 indexed platformHash,
    address indexed newAdminAddress
);
```

**Emitted when:** Platform admin address changes

### PlatformDataAdded

```solidity
event PlatformDataAdded(
    bytes32 indexed platformHash,
    bytes32 indexed platformDataKey
);
```

**Emitted when:** Platform data key is added

### PlatformDataRemoved

```solidity
event PlatformDataRemoved(
    bytes32 indexed platformHash,
    bytes32 platformDataKey
);
```

**Emitted when:** Platform data key is removed

## Errors

### GlobalParamsInvalidInput

```solidity
error GlobalParamsInvalidInput();
```

**Emitted when:** Invalid input provided

### GlobalParamsPlatformAlreadyListed

```solidity
error GlobalParamsPlatformAlreadyListed(bytes32 platformHash);
```

**Emitted when:** Attempting to list already-listed platform

### GlobalParamsPlatformNotListed

```solidity
error GlobalParamsPlatformNotListed(bytes32 platformHash);
```

**Emitted when:** Operation attempted on non-listed platform

## Usage Examples

### Platform Registration

```javascript
// Enlist a new platform
const platformHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-platform'));
const platformAdmin = '0x...'; // Platform admin address
const platformFeePercent = 500; // 5% fee (in basis points)

const tx = await globalParams.enlistPlatform(platformHash, platformAdmin, platformFeePercent);
await tx.wait();

// Add platform data
const categoryKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('category'));
await globalParams.addPlatformData(platformHash, categoryKey);

const nameKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('name'));
await globalParams.addPlatformData(platformHash, nameKey);
```

### Protocol Configuration

```javascript
// Get protocol configuration
const protocolAdmin = await globalParams.getProtocolAdminAddress();
const tokenAddress = await globalParams.getTokenAddress();
const protocolFee = await globalParams.getProtocolFeePercent();

console.log('Protocol Admin:', protocolAdmin);
console.log('Token Address:', tokenAddress);
console.log('Protocol Fee:', protocolFee.toString(), 'basis points');

// Update protocol admin
const newAdmin = '0x...';
await globalParams.updateProtocolAdminAddress(newAdmin);

// Update token
const newToken = '0x...';
await globalParams.updateTokenAddress(newToken);

// Update protocol fee
const newFee = 300; // 3%
await globalParams.updateProtocolFeePercent(newFee);
```

### Platform Management

```javascript
// Check if platform is listed
const isListed = await globalParams.checkIfPlatformIsListed(platformHash);
if (!isListed) {
  console.log('Platform not found');
}

// Get platform configuration
const platformAdmin = await globalParams.getPlatformAdminAddress(platformHash);
const platformFee = await globalParams.getPlatformFeePercent(platformHash);

// Update platform settings (as platform admin)
await globalParams.updatePlatformFeePercent(platformHash, 600); // 6%

// Update admin address
const newAdmin = '0x...';
await globalParams.updatePlatformAdminAddress(platformHash, newAdmin);
```

### Querying Platform Data

```javascript
// Add custom platform data
const tagsKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('tags'));
await globalParams.addPlatformData(platformHash, tagsKey);

// Check if data exists
const exists = await globalParams.checkPlatformData(platformHash, tagsKey);

// Remove data
await globalParams.removePlatformData(platformHash, tagsKey);
```

### Campaign Creation Flow

```javascript
// Before creating a campaign, validate platforms
async function validateCampaignPlatforms(selectedPlatforms) {
  for (const platformHash of selectedPlatforms) {
    const isListed = await globalParams.checkIfPlatformIsListed(platformHash);
    if (!isListed) {
      throw new Error(`Platform ${platformHash} is not listed`);
    }
    
    const platformFee = await globalParams.getPlatformFeePercent(platformHash);
    console.log(`Platform ${platformHash} fee:`, platformFee, 'basis points');
  }
}

// Use in campaign creation
await validateCampaignPlatforms(selectedPlatformHashes);
```

## Security Considerations

### Access Control

- **Owner Only**: Critical operations (enlist/delist platforms, update protocol params) restricted to owner
- **Platform Admin**: Platform-specific configurations managed by platform admins
- **Protocol Admin**: Emergency and maintenance operations

### Input Validation

- **Non-Zero Addresses**: All address inputs validated for non-zero values
- **Fee Limits**: Consider implementing reasonable fee bounds
- **Platform Validation**: Platform listing verified before operations

### Upgradeability

- **Owner Transfer**: Ownership can be transferred to new admin
- **Fee Changes**: Fee percentages can be updated without redeployment
- **Platform Changes**: Platforms can be delisted without affecting existing campaigns

## Integration Notes

### With CampaignInfoFactory

```javascript
// Campaign factory uses GlobalParams for validation
const factory = new ethers.Contract(
  factoryAddress,
  factoryABI,
  signer
);

// Factory queries GlobalParams during campaign creation
// to validate platform listings
```

### With Campaign Contracts

```javascript
// Campaign contracts read from GlobalParams
const protocolFee = await campaign.getProtocolFeePercent();
const tokenAddress = await campaign.getTokenAddress();

// Protocol admin operations
const isPaused = await campaign.paused();
const protocolAdmin = await campaign.getProtocolAdminAddress();
```

### Event Monitoring

```javascript
// Monitor platform enlistment
globalParams.on('PlatformEnlisted', (platformHash, adminAddress, feePercent, event) => {
  console.log('New platform enlisted:', platformHash);
  console.log('Admin:', adminAddress);
  console.log('Fee:', feePercent);
  
  // Update database
  await database.savePlatform(platformHash, adminAddress, feePercent);
});

// Monitor protocol updates
globalParams.on('ProtocolAdminAddressUpdated', (newAdmin) => {
  console.log('Protocol admin updated:', newAdmin);
  // Update access control
});
```

## Best Practices

### Fee Management

- Set reasonable fee percentages (typically 1-10%)
- Document fee structure clearly
- Consider implementing fee limits in contract

### Platform Administration

- Use multi-sig wallets for platform admins
- Keep admin keys secure
- Monitor platform configurations regularly

### Event Logging

- Listen to all events for audit trail
- Store event data off-chain
- Implement alerting for critical changes

## Next Steps

- [CampaignInfo](./campaign-info.md) - Campaign contract
- [CampaignInfoFactory](./campaign-info-factory.md) - Factory contract
- [TreasuryFactory](./treasury-factory.md) - Treasury management
- [Platform Integration](../guides/platform-integration.md) - Platform setup guide

