# CampaignInfoFactory

The `CampaignInfoFactory` contract is responsible for creating and managing campaign instances in the Oak Network protocol. It serves as the primary entry point for campaign creation and maintains a registry of all valid campaigns.

## Overview

```solidity
contract CampaignInfoFactory is Initializable, ICampaignInfoFactory, Ownable {
    IGlobalParams private GLOBAL_PARAMS;
    address private s_treasuryFactoryAddress;
    bool private s_initialized;
    address private s_implementation;
    mapping(address => bool) public isValidCampaignInfo;
    mapping(bytes32 => address) public identifierToCampaignInfo;
}
```

## Key Features

- **Campaign Creation**: Creates new campaign instances using the clone pattern
- **Campaign Registry**: Maintains a registry of all valid campaigns
- **Identifier Management**: Ensures unique campaign identifiers
- **Platform Validation**: Validates selected platforms before campaign creation
- **Implementation Management**: Manages campaign implementation contracts

## State Variables

### Core Configuration

| Variable | Type | Description |
|----------|------|-------------|
| `GLOBAL_PARAMS` | `IGlobalParams` | Global parameters contract reference |
| `s_treasuryFactoryAddress` | `address` | Address of the treasury factory |
| `s_initialized` | `bool` | Whether the factory is initialized |
| `s_implementation` | `address` | Campaign implementation contract address |

### Campaign Registry

| Variable | Type | Description |
|----------|------|-------------|
| `isValidCampaignInfo` | `mapping(address => bool)` | Maps campaign addresses to validity status |
| `identifierToCampaignInfo` | `mapping(bytes32 => address)` | Maps identifiers to campaign addresses |

## Functions

### Initialization

#### Constructor

```solidity
constructor(
    IGlobalParams globalParams,
    address campaignImplementation
) Ownable(msg.sender)
```

**Parameters:**
- `globalParams`: Address of the global parameters contract
- `campaignImplementation`: Address of the campaign implementation contract

**Effects:**
- Sets the global parameters reference
- Sets the campaign implementation address
- Initializes the owner

#### Initialize

```solidity
function _initialize(
    address treasuryFactoryAddress,
    address globalParams
) external onlyOwner initializer
```

**Parameters:**
- `treasuryFactoryAddress`: Address of the treasury factory
- `globalParams`: Address of the global parameters contract

**Effects:**
- Sets the treasury factory address
- Updates the global parameters reference
- Marks the factory as initialized

**Requirements:**
- Only callable by the owner
- Can only be called once
- Both addresses must be non-zero

### Campaign Creation

#### Create Campaign

```solidity
function createCampaign(
    address creator,
    bytes32 identifierHash,
    bytes32[] calldata selectedPlatformHash,
    bytes32[] calldata platformDataKey,
    bytes32[] calldata platformDataValue,
    CampaignData calldata campaignData
) external override
```

**Parameters:**
- `creator`: Address of the campaign creator
- `identifierHash`: Unique identifier for the campaign
- `selectedPlatformHash`: Array of selected platform hashes
- `platformDataKey`: Array of platform data keys
- `platformDataValue`: Array of platform data values
- `campaignData`: Campaign configuration data

**Effects:**
- Creates a new campaign instance
- Validates all platform selections
- Initializes the campaign with provided data
- Registers the campaign in the factory

**Requirements:**
- Campaign launch time must be in the future
- Campaign deadline must be after launch time
- All selected platforms must be listed
- Campaign identifier must be unique
- Platform data arrays must have matching lengths

**Events:**
- `CampaignInfoFactoryCampaignCreated(bytes32 indexed identifierHash, address indexed campaignAddress)`
- `CampaignInfoFactoryCampaignInitialized()`

### Implementation Management

#### Update Implementation

```solidity
function updateImplementation(
    address newImplementation
) external override onlyOwner
```

**Parameters:**
- `newImplementation`: Address of the new implementation contract

**Effects:**
- Updates the campaign implementation address
- Affects all future campaign creations

**Requirements:**
- Only callable by the owner
- New implementation must be non-zero

## Events

### Campaign Events

```solidity
event CampaignInfoFactoryCampaignCreated(
    bytes32 indexed identifierHash,
    address indexed campaignAddress
);

event CampaignInfoFactoryCampaignInitialized();
```

### Error Events

```solidity
error CampaignInfoFactoryAlreadyInitialized();
error CampaignInfoFactoryInvalidInput();
error CampaignInfoFactoryCampaignInitializationFailed();
error CampaignInfoFactoryPlatformNotListed(bytes32 platformHash);
error CampaignInfoFactoryCampaignWithSameIdentifierExists(
    bytes32 identifierHash,
    address cloneExists
);
```

## Usage Examples

### Basic Campaign Creation

```javascript
// Prepare campaign data
const campaignData = {
  creator: userAddress,
  identifierHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-campaign')),
  selectedPlatformHash: [platform1Hash, platform2Hash],
  platformDataKey: ['category', 'tags'],
  platformDataValue: [
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('technology')),
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('blockchain,defi'))
  ],
  campaignData: {
    launchTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    deadline: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
    goalAmount: ethers.utils.parseEther('10000') // $10,000 goal
  }
};

// Create campaign
const tx = await campaignFactory.createCampaign(
  campaignData.creator,
  campaignData.identifierHash,
  campaignData.selectedPlatformHash,
  campaignData.platformDataKey,
  campaignData.platformDataValue,
  campaignData.campaignData
);

await tx.wait();
```

### Platform Validation

```javascript
// Validate platforms before campaign creation
async function validatePlatforms(platformHashes) {
  for (const platformHash of platformHashes) {
    const isListed = await globalParams.checkIfPlatformIsListed(platformHash);
    if (!isListed) {
      throw new Error(`Platform ${platformHash} is not listed`);
    }
  }
}

// Use validation
await validatePlatforms(selectedPlatformHash);
```

### Campaign Registry Queries

```javascript
// Check if campaign is valid
const isValid = await campaignFactory.isValidCampaignInfo(campaignAddress);

// Get campaign by identifier
const campaignAddress = await campaignFactory.identifierToCampaignInfo(identifierHash);

// Check if identifier exists
const exists = campaignAddress !== ethers.constants.AddressZero;
```

## Security Considerations

### Access Control

- **Owner Only**: Critical functions like `updateImplementation` are restricted to the owner
- **Initialization**: Factory can only be initialized once to prevent reinitialization attacks
- **Platform Validation**: All platforms are validated before campaign creation

### Input Validation

- **Parameter Bounds**: All parameters are validated for reasonable ranges
- **Array Lengths**: Platform data arrays must have matching lengths
- **Address Validation**: All addresses are validated for non-zero values

### Reentrancy Protection

- **External Calls**: External calls are made last in functions
- **State Updates**: State is updated before external calls
- **Checks-Effects-Interactions**: Standard pattern implementation

## Gas Optimization

### Clone Pattern

The factory uses OpenZeppelin's `Clones` library for gas-efficient campaign creation:

```solidity
// Clone with immutable args
address clone = Clones.cloneWithImmutableArgs(s_implementation, args);
```

**Benefits:**
- **Gas Efficient**: Much cheaper than deploying new contracts
- **Immutable Args**: Critical parameters stored in immutable args
- **Upgradeable**: Implementation can be upgraded without affecting existing campaigns

### Storage Optimization

- **Minimal Storage**: Only essential data stored in factory
- **Event Logging**: Comprehensive event logging for off-chain indexing
- **Efficient Mappings**: Optimized data structures for lookups

## Integration Patterns

### Factory Pattern

```javascript
// Factory pattern implementation
class CampaignFactory {
  constructor(factoryContract, globalParams) {
    this.factory = factoryContract;
    this.globalParams = globalParams;
  }
  
  async createCampaign(campaignData) {
    // Validate inputs
    await this.validateCampaignData(campaignData);
    
    // Create campaign
    const tx = await this.factory.createCampaign(
      campaignData.creator,
      campaignData.identifierHash,
      campaignData.selectedPlatformHash,
      campaignData.platformDataKey,
      campaignData.platformDataValue,
      campaignData.campaignData
    );
    
    return tx;
  }
  
  async validateCampaignData(campaignData) {
    // Validate launch time
    if (campaignData.campaignData.launchTime <= Math.floor(Date.now() / 1000)) {
      throw new Error('Launch time must be in the future');
    }
    
    // Validate deadline
    if (campaignData.campaignData.deadline <= campaignData.campaignData.launchTime) {
      throw new Error('Deadline must be after launch time');
    }
    
    // Validate platforms
    for (const platformHash of campaignData.selectedPlatformHash) {
      const isListed = await this.globalParams.checkIfPlatformIsListed(platformHash);
      if (!isListed) {
        throw new Error(`Platform ${platformHash} is not listed`);
      }
    }
  }
}
```

### Event Monitoring

```javascript
// Event monitoring for campaign creation
class CampaignMonitor {
  constructor(factoryContract) {
    this.factory = factoryContract;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.factory.on('CampaignInfoFactoryCampaignCreated', (event) => {
      this.handleCampaignCreated(event);
    });
  }
  
  async handleCampaignCreated(event) {
    const { identifierHash, campaignAddress } = event.args;
    
    // Update local database
    await this.updateCampaignDatabase(identifierHash, campaignAddress);
    
    // Notify users
    await this.notifyUsers(identifierHash, campaignAddress);
  }
}
```

## Error Handling

### Common Errors

```javascript
try {
  await campaignFactory.createCampaign(campaignData);
} catch (error) {
  if (error.message.includes('CampaignInfoFactoryInvalidInput')) {
    console.error('Invalid input provided');
  } else if (error.message.includes('CampaignInfoFactoryPlatformNotListed')) {
    console.error('Selected platform is not listed');
  } else if (error.message.includes('CampaignInfoFactoryCampaignWithSameIdentifierExists')) {
    console.error('Campaign with this identifier already exists');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

### Retry Logic

```javascript
async function createCampaignWithRetry(campaignData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await campaignFactory.createCampaign(campaignData);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Testing

### Unit Tests

```javascript
describe('CampaignInfoFactory', () => {
  let factory;
  let globalParams;
  let mockImplementation;
  
  beforeEach(async () => {
    // Setup test environment
    globalParams = await deployGlobalParams();
    mockImplementation = await deployMockCampaign();
    factory = await deployCampaignFactory(globalParams.address, mockImplementation.address);
  });
  
  it('should create a campaign', async () => {
    const campaignData = {
      creator: userAddress,
      identifierHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('test-campaign')),
      selectedPlatformHash: [platformHash],
      platformDataKey: [],
      platformDataValue: [],
      campaignData: {
        launchTime: Math.floor(Date.now() / 1000) + 3600,
        deadline: Math.floor(Date.now() / 1000) + 86400,
        goalAmount: ethers.utils.parseEther('1000')
      }
    };
    
    const tx = await factory.createCampaign(
      campaignData.creator,
      campaignData.identifierHash,
      campaignData.selectedPlatformHash,
      campaignData.platformDataKey,
      campaignData.platformDataValue,
      campaignData.campaignData
    );
    
    await expect(tx).to.emit(factory, 'CampaignInfoFactoryCampaignCreated');
  });
});
```

## Next Steps

- [CampaignInfo Contract](/docs/contracts/campaign-info) - Campaign instance contract
- [GlobalParams Contract](/docs/contracts/global-params) - Global parameters management
- [TreasuryFactory Contract](/docs/contracts/treasury-factory) - Treasury creation




