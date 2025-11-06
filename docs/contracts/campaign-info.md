# CampaignInfo

The `CampaignInfo` contract is the core campaign management contract in the Oak Network protocol. It stores campaign metadata, manages platform configurations, and controls campaign lifecycle states including launch time, deadline, and funding goals.

## Overview

```solidity
contract CampaignInfo is
    ICampaignData,
    ICampaignInfo,
    Ownable,
    PausableCancellable,
    TimestampChecker,
    AdminAccessChecker,
    Initializable
{
    CampaignData private s_campaignData;
    mapping(bytes32 => address) private s_platformTreasuryAddress;
    mapping(bytes32 => uint256) private s_platformFeePercent;
    mapping(bytes32 => bool) private s_isSelectedPlatform;
    mapping(bytes32 => bool) private s_isApprovedPlatform;
    mapping(bytes32 => bytes32) private s_platformData;
    bytes32[] private s_approvedPlatformHashes;
}
```

## Key Features

- **Campaign Metadata**: Stores launch time, deadline, and goal amount
- **Platform Management**: Tracks selected and approved platforms for campaigns
- **Fee Configuration**: Manages protocol and platform fee percentages
- **Access Control**: Multiple levels of access (owner, platform admin, protocol admin)
- **State Management**: Pausable and cancellable with emergency controls
- **Time Validation**: Enforces launch and deadline constraints

## State Variables

### Campaign Data

| Variable | Type | Description |
|----------|------|-------------|
| `s_campaignData` | `CampaignData` | Campaign configuration (launch time, deadline, goal) |
| `s_identifierHash` | `bytes32` | Unique campaign identifier |

### Platform Management

| Variable | Type | Description |
|----------|------|-------------|
| `s_platformTreasuryAddress` | `mapping(bytes32 => address)` | Maps platform hash to treasury address |
| `s_platformFeePercent` | `mapping(bytes32 => uint256)` | Maps platform hash to fee percentage |
| `s_isSelectedPlatform` | `mapping(bytes32 => bool)` | Whether platform is selected for campaign |
| `s_isApprovedPlatform` | `mapping(bytes32 => bool)` | Whether platform is approved (treasury deployed) |
| `s_platformData` | `mapping(bytes32 => bytes32)` | Platform-specific data storage |
| `s_approvedPlatformHashes` | `bytes32[]` | Array of approved platform hashes |

## Functions

### Initialization

#### Constructor

```solidity
constructor(address creator) Ownable(creator);
```

**Parameters:**
- `creator`: Address of the campaign creator (becomes owner)

**Effects:**
- Sets the contract owner to the creator
- Initializes base contracts

#### Initialize

```solidity
function initialize(
    address creator,
    IGlobalParams globalParams,
    bytes32[] calldata selectedPlatformHash,
    bytes32[] calldata platformDataKey,
    bytes32[] calldata platformDataValue,
    CampaignData calldata campaignData
) external initializer;
```

**Parameters:**
- `creator`: Address of the campaign creator
- `globalParams`: Global parameters contract reference
- `selectedPlatformHash`: Array of selected platform hashes
- `platformDataKey`: Array of platform data keys
- `platformDataValue`: Array of platform data values
- `campaignData`: Campaign configuration data

**Effects:**
- Initializes the campaign with configuration data
- Sets up platform selections
- Configures platform-specific data
- Registers with global parameters

**Requirements:**
- Can only be called once (initializer modifier)
- Launch time must be in the future
- Deadline must be after launch time
- Goal amount must be greater than zero
- Platform arrays must have matching lengths

### Campaign Data Retrieval

#### Get Campaign Config

```solidity
function getCampaignConfig() public view returns (Config memory config);
```

**Returns:**
- Complete campaign configuration including treasury factory, token, protocol fee, and identifier

#### Get Launch Time

```solidity
function getLaunchTime() public view override returns (uint256);
```

**Returns:**
- Campaign launch timestamp

#### Get Deadline

```solidity
function getDeadline() public view override returns (uint256);
```

**Returns:**
- Campaign end timestamp

#### Get Goal Amount

```solidity
function getGoalAmount() external view override returns (uint256);
```

**Returns:**
- Funding goal amount in campaign's token

#### Get Token Address

```solidity
function getTokenAddress() external view override returns (address);
```

**Returns:**
- Address of the campaign's token contract

#### Get Protocol Fee Percent

```solidity
function getProtocolFeePercent() external view override returns (uint256);
```

**Returns:**
- Protocol fee percentage

#### Get Identifier Hash

```solidity
function getIdentifierHash() external view override returns (bytes32);
```

**Returns:**
- Unique campaign identifier hash

### Platform Management

#### Check If Platform Selected

```solidity
function checkIfPlatformSelected(bytes32 platformHash) public view override returns (bool);
```

**Parameters:**
- `platformHash`: Platform identifier hash

**Returns:**
- True if platform is selected for the campaign

#### Check If Platform Approved

```solidity
function checkIfPlatformApproved(bytes32 platformHash) public view returns (bool);
```

**Parameters:**
- `platformHash`: Platform identifier hash

**Returns:**
- True if platform has treasury deployed

#### Get Approved Platform Hashes

```solidity
function getApprovedPlatformHashes() external view returns (bytes32[] memory);
```

**Returns:**
- Array of all approved platform hashes

#### Get Platform Admin Address

```solidity
function getPlatformAdminAddress(bytes32 platformHash) external view override returns (address);
```

**Parameters:**
- `platformHash`: Platform identifier hash

**Returns:**
- Address of the platform administrator

#### Get Platform Fee Percent

```solidity
function getPlatformFeePercent(bytes32 platformHash) external view override returns (uint256);
```

**Parameters:**
- `platformHash`: Platform identifier hash

**Returns:**
- Platform fee percentage for the campaign

#### Get Platform Data

```solidity
function getPlatformData(bytes32 platformDataKey) external view override returns (bytes32);
```

**Parameters:**
- `platformDataKey`: Platform data key

**Returns:**
- Platform-specific data value

### Campaign Updates

#### Update Launch Time

```solidity
function updateLaunchTime(uint256 launchTime)
    external
    override
    onlyOwner
    currentTimeIsLess(getLaunchTime())
    whenNotPaused
    whenNotCancelled;
```

**Parameters:**
- `launchTime`: New launch timestamp

**Effects:**
- Updates campaign launch time
- Emits `CampaignInfoLaunchTimeUpdated` event

**Requirements:**
- Only callable by owner
- Campaign must not be launched yet
- Campaign must not be paused or cancelled

#### Update Deadline

```solidity
function updateDeadline(uint256 deadline)
    external
    override
    onlyOwner
    currentTimeIsLess(getLaunchTime())
    whenNotPaused
    whenNotCancelled;
```

**Parameters:**
- `deadline`: New deadline timestamp

**Effects:**
- Updates campaign deadline
- Emits `CampaignInfoDeadlineUpdated` event

**Requirements:**
- Only callable by owner
- Campaign must not be launched yet
- Deadline must be after launch time

#### Update Goal Amount

```solidity
function updateGoalAmount(uint256 goalAmount)
    external
    override
    onlyOwner
    currentTimeIsLess(getLaunchTime())
    whenNotPaused
    whenNotCancelled;
```

**Parameters:**
- `goalAmount`: New funding goal amount

**Effects:**
- Updates campaign goal amount
- Emits `CampaignInfoGoalAmountUpdated` event

**Requirements:**
- Only callable by owner
- Campaign must not be launched yet
- Goal amount must be greater than zero

#### Update Selected Platform

```solidity
function updateSelectedPlatform(bytes32 platformHash, bool selection)
    external
    override
    onlyOwner
    currentTimeIsLess(getLaunchTime())
    whenNotPaused
    whenNotCancelled;
```

**Parameters:**
- `platformHash`: Platform identifier hash
- `selection`: Whether to select the platform

**Effects:**
- Updates platform selection status
- Emits `CampaignInfoSelectedPlatformUpdated` event

**Requirements:**
- Only callable by owner
- Campaign must not be launched yet
- Platform must not be approved (treasury deployed)

### Access Control

#### Owner

```solidity
function owner() public view override(ICampaignInfo, Ownable) returns (address account);
```

**Returns:**
- Address of the campaign owner

#### Transfer Ownership

```solidity
function transferOwnership(address newOwner)
    public
    override(ICampaignInfo, Ownable)
    onlyOwner
    whenNotPaused
    whenNotCancelled;
```

**Parameters:**
- `newOwner`: New owner address

**Effects:**
- Transfers campaign ownership

**Requirements:**
- Only callable by current owner
- Campaign must not be paused or cancelled

#### Get Protocol Admin Address

```solidity
function getProtocolAdminAddress() public view override returns (address);
```

**Returns:**
- Address of the protocol administrator

### State Management

#### Paused

```solidity
function paused() public view override(ICampaignInfo, PausableCancellable) returns (bool);
```

**Returns:**
- True if campaign is paused

#### Cancelled

```solidity
function cancelled() public view override(ICampaignInfo, PausableCancellable) returns (bool);
```

**Returns:**
- True if campaign is cancelled

#### Pause Campaign

```solidity
function _pauseCampaign(bytes32 message) external onlyProtocolAdmin;
```

**Parameters:**
- `message`: Reason for pausing

**Effects:**
- Pauses the campaign
- Prevents all state-changing operations

**Requirements:**
- Only callable by protocol admin

#### Unpause Campaign

```solidity
function _unpauseCampaign(bytes32 message) external onlyProtocolAdmin;
```

**Parameters:**
- `message`: Reason for unpausing

**Effects:**
- Resumes the campaign
- Re-enables state-changing operations

**Requirements:**
- Only callable by protocol admin

#### Cancel Campaign

```solidity
function _cancelCampaign(bytes32 message) external;
```

**Parameters:**
- `message`: Reason for cancellation

**Effects:**
- Cancels the campaign
- Irreversibly ends the campaign

**Requirements:**
- Only callable by owner or protocol admin

### Platform Information

#### Set Platform Info

```solidity
function _setPlatformInfo(bytes32 platformHash, address platformTreasuryAddress) external whenNotPaused;
```

**Parameters:**
- `platformHash`: Platform identifier hash
- `platformTreasuryAddress`: Platform treasury address

**Effects:**
- Sets platform treasury address and fee configuration
- Marks platform as approved
- Emits `CampaignInfoPlatformInfoUpdated` event

**Requirements:**
- Campaign must not be paused

## Events

### CampaignInfoLaunchTimeUpdated

```solidity
event CampaignInfoLaunchTimeUpdated(uint256 newLaunchTime);
```

**Emitted when:** Campaign launch time is updated

### CampaignInfoDeadlineUpdated

```solidity
event CampaignInfoDeadlineUpdated(uint256 newDeadline);
```

**Emitted when:** Campaign deadline is updated

### CampaignInfoGoalAmountUpdated

```solidity
event CampaignInfoGoalAmountUpdated(uint256 newGoalAmount);
```

**Emitted when:** Campaign goal amount is updated

### CampaignInfoSelectedPlatformUpdated

```solidity
event CampaignInfoSelectedPlatformUpdated(bytes32 indexed platformHash, bool selection);
```

**Emitted when:** Platform selection status changes

### CampaignInfoPlatformInfoUpdated

```solidity
event CampaignInfoPlatformInfoUpdated(bytes32 indexed platformHash, address indexed platformTreasury);
```

**Emitted when:** Platform treasury is deployed and configured

## Errors

### CampaignInfoInvalidPlatformUpdate

```solidity
error CampaignInfoInvalidPlatformUpdate(bytes32 platformHash, bool selection);
```

**Emitted when:** Attempting to update an already-approved platform

### CampaignInfoUnauthorized

```solidity
error CampaignInfoUnauthorized();
```

**Emitted when:** Unauthorized action attempted

### CampaignInfoInvalidInput

```solidity
error CampaignInfoInvalidInput();
```

**Emitted when:** Invalid input provided

### CampaignInfoPlatformNotSelected

```solidity
error CampaignInfoPlatformNotSelected(bytes32 platformHash);
```

**Emitted when:** Platform operation attempted on non-selected platform

### CampaignInfoPlatformAlreadyApproved

```solidity
error CampaignInfoPlatformAlreadyApproved(bytes32 platformHash);
```

**Emitted when:** Platform is already approved

## Data Structures

### CampaignData

```solidity
struct CampaignData {
    uint256 launchTime;    // Campaign launch timestamp
    uint256 deadline;      // Campaign end timestamp
    uint256 goalAmount;    // Target funding amount
}
```

### Config

```solidity
struct Config {
    address treasuryFactory;     // Treasury factory address
    address token;               // Campaign token address
    uint256 protocolFeePercent;  // Protocol fee percentage
    bytes32 identifierHash;      // Unique campaign identifier
}
```

## Usage Examples

### Reading Campaign Information

```javascript
// Get campaign configuration
const config = await campaignInfo.getCampaignConfig();
console.log('Treasury Factory:', config.treasuryFactory);
console.log('Token:', config.token);
console.log('Protocol Fee:', config.protocolFeePercent);

// Get campaign timeline
const launchTime = await campaignInfo.getLaunchTime();
const deadline = await campaignInfo.getDeadline();
console.log('Launch:', new Date(launchTime.toNumber() * 1000));
console.log('Ends:', new Date(deadline.toNumber() * 1000));

// Check campaign state
const isPaused = await campaignInfo.paused();
const isCancelled = await campaignInfo.cancelled();
console.log('Paused:', isPaused, 'Cancelled:', isCancelled);
```

### Updating Campaign Parameters

```javascript
// Update launch time (only before launch)
const newLaunchTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
const tx = await campaignInfo.updateLaunchTime(newLaunchTime);
await tx.wait();

// Update deadline
const newDeadline = Math.floor(Date.now() / 1000) + 2592000; // 30 days
const tx2 = await campaignInfo.updateDeadline(newDeadline);
await tx2.wait();

// Update goal amount
const newGoal = ethers.utils.parseEther('20000');
const tx3 = await campaignInfo.updateGoalAmount(newGoal);
await tx3.wait();
```

### Platform Management

```javascript
// Get all approved platforms
const approvedPlatforms = await campaignInfo.getApprovedPlatformHashes();
console.log('Approved platforms:', approvedPlatforms);

// Check platform status
const platformHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-platform'));
const isSelected = await campaignInfo.checkIfPlatformSelected(platformHash);
const isApproved = await campaignInfo.checkIfPlatformApproved(platformHash);

// Get platform configuration
const platformAdmin = await campaignInfo.getPlatformAdminAddress(platformHash);
const platformFee = await campaignInfo.getPlatformFeePercent(platformHash);
const platformTreasury = await campaignInfo.getPlatformTreasuryAddress(platformHash);

// Update platform selection
const tx = await campaignInfo.updateSelectedPlatform(platformHash, true);
await tx.wait();
```

## Security Considerations

### Access Control

- **Owner Only**: Critical updates (launch time, deadline, goal) can only be made by owner
- **Pre-Launch Only**: Most updates can only be made before campaign launch
- **Platform Protection**: Approved platforms cannot be modified
- **Emergency Controls**: Protocol admin can pause/cancel campaigns

### Time Validation

- **Launch Time**: Must be in the future when set
- **Deadline**: Must be after launch time
- **Launch Lock**: Once launched, timeline cannot be modified
- **Time Checkers**: All time updates use `TimestampChecker` validations

### State Protection

- **Paused State**: Prevents most state changes
- **Cancelled State**: Campaign operations are permanently disabled
- **Irreversible**: Cancellation is permanent

## Gas Optimization

### Storage Layout

The contract uses efficient storage patterns:
- Packed storage for mappings
- Minimal state variables
- Efficient array operations

### Access Patterns

- Read-only operations are gas-free (view functions)
- State updates only when necessary
- Batch operations minimize calls

## Integration Notes

### With CampaignInfoFactory

```javascript
// Campaign is created by factory
const factory = await ethers.getContractAt('CampaignInfoFactory', factoryAddress);
const tx = await factory.createCampaign(campaignData);
const receipt = await tx.wait();

// Extract campaign address from event
const campaignAddress = receipt.events.find(e => 
  e.event === 'CampaignInfoFactoryCampaignCreated'
).args.campaignAddress;

// Connect to campaign
const campaign = await ethers.getContractAt('CampaignInfo', campaignAddress);
```

### With Treasury

```javascript
// Get platform treasury address
const treasuryAddress = await campaign.getPlatformTreasuryAddress(platformHash);

// Connect to treasury
const treasury = await ethers.getContractAt('AllOrNothing', treasuryAddress);

// Check campaign state before operations
const isPaused = await campaign.paused();
const isCancelled = await campaign.cancelled();

if (isPaused || isCancelled) {
  throw new Error('Campaign is not active');
}
```

## Next Steps

- [CampaignInfoFactory](./campaign-info-factory.md) - Factory contract documentation
- [GlobalParams](./global-params.md) - Global parameters contract
- [TreasuryFactory](./treasury-factory.md) - Treasury creation contract
- [Platform Integration](../guides/platform-integration.md) - How to integrate platforms





