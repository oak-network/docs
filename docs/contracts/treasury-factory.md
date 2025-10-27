# TreasuryFactory

The `TreasuryFactory` contract is responsible for deploying treasury contracts for campaigns. It manages treasury implementations, handles platform-specific configurations, and creates treasury instances using the clone pattern for gas efficiency.

## Overview

```solidity
contract TreasuryFactory is ITreasuryFactory, AdminAccessChecker {
    mapping(bytes32 => mapping(uint256 => address)) private implementationMap;
    mapping(address => bool) private approvedImplementations;
}
```

## Key Features

- **Treasury Deployment**: Creates treasury contracts for campaigns using clone pattern
- **Implementation Management**: Registers and approves treasury implementations per platform
- **Platform-Specific**: Each platform can have multiple treasury implementations
- **Protocol Approval**: All implementations must be approved by protocol admin before use
- **Access Control**: Platform admins register implementations, protocol admin approves them
- **Gas Efficient**: Uses minimal proxy pattern for low-cost deployments

## State Variables

### ImplementationMap

| Variable | Type | Description |
|----------|------|-------------|
| `implementationMap` | `mapping(bytes32 => mapping(uint256 => address))` | Maps platform and implementation ID to implementation address |

### ApprovedImplementations

| Variable | Type | Description |
|----------|------|-------------|
| `approvedImplementations` | `mapping(address => bool)` | Whether an implementation is approved by protocol admin |

## Functions

### Constructor

```solidity
constructor(IGlobalParams globalParams);
```

**Parameters:**
- `globalParams`: Global parameters contract reference

**Effects:**
- Initializes admin access checker with GlobalParams
- Sets up access control for platform and protocol admins

### Treasury Implementation Registration

#### Register Treasury Implementation

```solidity
function registerTreasuryImplementation(
    bytes32 platformHash,
    uint256 implementationId,
    address implementation
) external override onlyPlatformAdmin(platformHash);
```

**Parameters:**
- `platformHash`: Platform identifier
- `implementationId`: Unique ID for this implementation
- `implementation`: Contract address of the treasury implementation

**Effects:**
- Registers treasury implementation for platform
- Can be called before approval

**Requirements:**
- Only callable by platform admin
- Implementation address must be non-zero

**Usage:**
- Platform admin registers their treasury implementations
- Multiple implementations can be registered per platform
- Implementation IDs are platform-specific

#### Approve Treasury Implementation

```solidity
function approveTreasuryImplementation(
    bytes32 platformHash,
    uint256 implementationId
) external override onlyProtocolAdmin;
```

**Parameters:**
- `platformHash`: Platform identifier
- `implementationId`: Implementation ID to approve

**Effects:**
- Approves implementation for use in deployments
- Emits approval event

**Requirements:**
- Only callable by protocol admin
- Implementation must be registered

**Security:**
- Protocol admin review required before deployments
- Prevents malicious implementations from being used

#### Disapprove Treasury Implementation

```solidity
function disapproveTreasuryImplementation(address implementation) 
    external 
    override 
    onlyProtocolAdmin;
```

**Parameters:**
- `implementation`: Implementation address to disapprove

**Effects:**
- Revokes approval for implementation
- Prevents new deployments using this implementation

**Requirements:**
- Only callable by protocol admin

**Use Cases:**
- Security issues discovered
- Updated implementation available
- Deprecated functionality

#### Remove Treasury Implementation

```solidity
function removeTreasuryImplementation(
    bytes32 platformHash,
    uint256 implementationId
) external override onlyPlatformAdmin(platformHash);
```

**Parameters:**
- `platformHash`: Platform identifier
- `implementationId`: Implementation ID to remove

**Effects:**
- Removes implementation registration from platform
- Prevents new deployments

**Requirements:**
- Only callable by platform admin

### Treasury Deployment

#### Deploy Treasury

```solidity
function deploy(
    bytes32 platformHash,
    address infoAddress,
    uint256 implementationId,
    string calldata name,
    string calldata symbol
) external override onlyPlatformAdmin(platformHash) returns (address clone);
```

**Parameters:**
- `platformHash`: Platform identifier
- `infoAddress`: CampaignInfo contract address
- `implementationId`: Implementation to deploy
- `name`: Treasury contract name
- `symbol`: Treasury contract symbol

**Returns:**
- Address of deployed treasury clone

**Effects:**
- Creates new treasury contract using clone pattern
- Initializes treasury with campaign info
- Sets up platform configuration

**Requirements:**
- Only callable by platform admin
- Implementation must be approved
- Campaign info address must be valid

### Query Functions

#### Get Treasury Address

```solidity
function getTreasuryAddress(
    bytes32 platformHash,
    uint256 implementationId
) external view override returns (address);
```

**Parameters:**
- `platformHash`: Platform identifier
- `implementationId`: Implementation ID

**Returns:**
- Treasury implementation address

#### Check Implementation Approved

```solidity
function checkImplementationApproved(address implementation) 
    external 
    view 
    override 
    returns (bool);
```

**Parameters:**
- `implementation`: Implementation address to check

**Returns:**
- True if implementation is approved

## Events

### TreasuryImplementationRegistered

```solidity
event TreasuryImplementationRegistered(
    bytes32 indexed platformHash,
    uint256 indexed implementationId,
    address indexed implementation
);
```

**Emitted when:** Platform admin registers an implementation

### TreasuryImplementationApproved

```solidity
event TreasuryImplementationApproved(
    bytes32 indexed platformHash,
    uint256 indexed implementationId,
    address indexed implementation
);
```

**Emitted when:** Protocol admin approves an implementation

### TreasuryImplementationDisapproved

```solidity
event TreasuryImplementationDisapproved(address indexed implementation);
```

**Emitted when:** Protocol admin disapproves an implementation

### TreasuryDeployed

```solidity
event TreasuryDeployed(
    bytes32 indexed platformHash,
    address indexed treasuryAddress,
    address indexed infoAddress
);
```

**Emitted when:** New treasury is deployed

## Errors

### TreasuryFactoryUnauthorized

```solidity
error TreasuryFactoryUnauthorized();
```

**Emitted when:** Unauthorized action attempted

### TreasuryFactoryInvalidAddress

```solidity
error TreasuryFactoryInvalidAddress();
```

**Emitted when:** Zero address provided

### TreasuryFactoryImplementationNotSet

```solidity
error TreasuryFactoryImplementationNotSet();
```

**Emitted when:** Implementation not registered

### TreasuryFactoryImplementationNotSetOrApproved

```solidity
error TreasuryFactoryImplementationNotSetOrApproved();
```

**Emitted when:** Implementation not approved for deployment

### TreasuryFactoryTreasuryCreationFailed

```solidity
error TreasuryFactoryTreasuryCreationFailed();
```

**Emitted when:** Treasury deployment fails

### TreasuryFactoryTreasuryInitializationFailed

```solidity
error TreasuryFactoryTreasuryInitializationFailed();
```

**Emitted when:** Treasury initialization fails

### TreasuryFactorySettingPlatformInfoFailed

```solidity
error TreasuryFactorySettingPlatformInfoFailed();
```

**Emitted when:** Setting platform info on campaign fails

## Usage Examples

### Platform Setup

```javascript
// Platform admin registers implementation
const treasuryFactory = await ethers.getContractAt(
  'TreasuryFactory',
  treasuryFactoryAddress
);

const implementationAddress = '0x...'; // AllOrNothing contract
const implementationId = 1; // Platform-specific ID

await treasuryFactory.registerTreasuryImplementation(
  platformHash,
  implementationId,
  implementationAddress
);
```

### Protocol Approval

```javascript
// Protocol admin approves implementation
await treasuryFactory.approveTreasuryImplementation(
  platformHash,
  implementationId,
  { from: protocolAdmin }
);
```

### Deploy Treasury for Campaign

```javascript
// Deploy treasury for a campaign
const campaignInfoAddress = '0x...';
const name = 'Oak Campaign Treasury';
const symbol = 'OAK-CT';

const tx = await treasuryFactory.deploy(
  platformHash,
  campaignInfoAddress,
  implementationId,
  name,
  symbol
);

const receipt = await tx.wait();

// Extract treasury address from event
const treasuryAddress = receipt.events.find(
  e => e.event === 'TreasuryDeployed'
).args.treasuryAddress;

console.log('Treasury deployed:', treasuryAddress);
```

### Check Implementation Status

```javascript
// Check if implementation is approved
const approved = await treasuryFactory.checkImplementationApproved(
  implementationAddress
);

// Get implementation address
const implementation = await treasuryFactory.getTreasuryAddress(
  platformHash,
  implementationId
);

console.log('Approved:', approved);
console.log('Implementation:', implementation);
```

### Complete Workflow

```javascript
// 1. Platform registers implementation
await treasuryFactory.registerTreasuryImplementation(
  platformHash,
  implementationId,
  implementationAddress
);

// 2. Protocol admin reviews and approves
await treasuryFactory.approveTreasuryImplementation(
  platformHash,
  implementationId,
  { from: protocolAdmin }
);

// 3. Campaign creation triggers treasury deployment
const campaignFactory = await ethers.getContractAt(
  'CampaignInfoFactory',
  campaignFactoryAddress
);

const createTx = await campaignFactory.createCampaign(campaignData);
const campaignReceipt = await createTx.wait();

// 4. Platform deploys treasury for campaign
const treasuryAddress = await treasuryFactory.deploy(
  platformHash,
  campaignInfoAddress,
  implementationId,
  'My Campaign Treasury',
  'MCT'
);

// 5. Connect to treasury
const treasury = await ethers.getContractAt(
  'AllOrNothing',
  treasuryAddress
);
```

## Security Considerations

### Two-Stage Approval

- **Registration**: Platform admin registers implementation
- **Approval**: Protocol admin must approve before use
- **Review Process**: Allows code review before production use
- **Deprecation**: Can disapprove implementations with issues

### Access Control

- **Platform Admin**: Registers implementations, deploys treasuries
- **Protocol Admin**: Approves implementations, can revoke approval
- **Separation of Concerns**: Platform manages platform-level config, protocol manages security

### Clone Pattern

- **Gas Efficiency**: Minimal proxy pattern reduces deployment costs
- **Upgradeability**: Implementation can be upgraded, existing clones use new logic
- **Consistency**: All clones share same implementation code

### Implementation Verification

- **Approval Required**: Cannot deploy unapproved implementations
- **Audit Trail**: All approvals/disapprovals logged via events
- **Quick Revocation**: Can disapprove implementations immediately

## Integration Notes

### With CampaignInfoFactory

```javascript
// Campaign factory calls treasury factory
// when creating campaigns

// 1. Create campaign
const campaignTx = await campaignFactory.createCampaign({
  creator,
  identifierHash,
  selectedPlatformHash,
  platformDataKey,
  platformDataValue,
  campaignData
});

// 2. Factory internally calls treasury factory
// to deploy treasuries for each platform

// 3. Platform managers treasury operations
```

### With Treasury Contracts

```javascript
// Treasury factory deploys clones
const treasuryClone = await treasuryFactory.deploy(...);

// Clone uses implementation logic
const treasury = new ethers.Contract(
  treasuryClone,
  AllOrNothingABI,
  signer
);

// All treasury operations work normally
await treasury.pledgeForAReward(rewardId, amount);
```

### Event Monitoring

```javascript
// Monitor approval events
treasuryFactory.on('TreasuryImplementationApproved', 
  (platformHash, implementationId, implementation, event) => {
    console.log('Implementation approved:', implementationId);
    
    // Update frontend to show as available
    updatePlatformImplementations(platformHash, implementationId);
  }
);

// Monitor deployment events
treasuryFactory.on('TreasuryDeployed', 
  (platformHash, treasuryAddress, infoAddress, event) => {
    console.log('New treasury:', treasuryAddress);
    
    // Index treasury for queries
    await indexTreasury(treasuryAddress, platformHash);
  }
);
```

## Best Practices

### Implementation Management

- Test implementations thoroughly before registration
- Use semantic versioning for implementation IDs
- Document implementation differences and use cases
- Keep approved implementations minimal

### Platform Configuration

- Use one implementation per funding model (AllOrNothing, KeepWhatsRaised)
- Reserve implementation ID 1 for default implementation
- Use higher IDs for experimental or platform-specific models

### Security

- Regular security audits of implementations
- Quick disapproval process for vulnerabilities
- Monitor all deployment events
- Maintain implementation registry off-chain

## Upgrade Path

### Updating Implementation

```javascript
// 1. Deploy new implementation
const newImplementation = await deployNewTreasuryImplementation();

// 2. Register with same ID (overwrites)
await treasuryFactory.registerTreasuryImplementation(
  platformHash,
  implementationId,
  newImplementation
);

// 3. Protocol admin approves
await treasuryFactory.approveTreasuryImplementation(
  platformHash,
  implementationId
);

// 4. New deployments use updated implementation
// Existing clones remain on old version
```

### Deprecation

```javascript
// Disapprove old implementation
await treasuryFactory.disapproveTreasuryImplementation(
  oldImplementation
);

// New deployments will revert
// Existing treasuries continue operating
```

## Next Steps

- [CampaignInfo](./campaign-info.md) - Campaign contract
- [GlobalParams](./global-params.md) - Protocol configuration
- [AllOrNothing](./all-or-nothing.md) - Treasury implementation
- [BaseTreasury](./base-treasury.md) - Treasury base contract
- [Treasury Integration](../guides/treasury-integration.md) - Treasury setup guide

