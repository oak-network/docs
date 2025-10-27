# BaseTreasury

The `BaseTreasury` is an abstract base contract that provides common functionality for all treasury implementations in the Oak Network protocol. It defines the standard interface for fee distribution, fund management, and campaign state handling that all treasury types inherit.

## Overview

```solidity
abstract contract BaseTreasury is
    Initializable,
    ICampaignTreasury,
    CampaignAccessChecker,
    PausableCancellable
{
    using SafeERC20 for IERC20;
    
    bytes32 internal constant ZERO_BYTES;
    uint256 internal constant PERCENT_DIVIDER = 10000;
    
    bytes32 internal PLATFORM_HASH;
    uint256 internal PLATFORM_FEE_PERCENT;
    IERC20 internal TOKEN;
    
    uint256 internal s_pledgedAmount;
    bool internal s_feesDisbursed;
}
```

## Key Features

- **Abstract Base Contract**: Extended by AllOrNothing, KeepWhatsRaised, and other treasury types
- **Fee Distribution**: Standard fee disbursement logic
- **Access Control**: Inherits campaign-specific access control
- **State Management**: Pausable and cancellable functionality
- **Success Condition**: Abstract method for funding model-specific logic
- **Safe Token Handling**: Uses SafeERC20 for secure transfers

## Constants

### PERCENT_DIVIDER

```solidity
uint256 internal constant PERCENT_DIVIDER = 10000;
```

**Purpose:** Used for percentage calculations (10000 = 100%)
**Usage:** Fee percentages are stored in basis points

### ZERO_BYTES

```solidity
bytes32 internal constant ZERO_BYTES = 0x0...0;
```

**Purpose:** Zero bytes comparison value
**Usage:** Checking for empty hash values

## State Variables

### Platform Configuration

| Variable | Type | Description |
|----------|------|-------------|
| `PLATFORM_HASH` | `bytes32` | Platform identifier |
| `PLATFORM_FEE_PERCENT` | `uint256` | Platform fee percentage |
| `TOKEN` | `IERC20` | Campaign token contract |

### Funding State

| Variable | Type | Description |
|----------|------|-------------|
| `s_pledgedAmount` | `uint256` | Total pledged amount |
| `s_feesDisbursed` | `bool` | Whether fees have been distributed |

## Functions

### Initialization

#### Init Base Contract

```solidity
function __BaseContract_init(
    bytes32 platformHash,
    address infoAddress
) internal;
```

**Parameters:**
- `platformHash`: Platform identifier
- `infoAddress`: CampaignInfo contract address

**Effects:**
- Initializes campaign access checker
- Sets platform hash
- Loads token address from campaign info
- Sets platform fee percentage

**Called by:**
- All treasury implementations in their `initialize()` functions

### Query Functions

#### Get Platform Hash

```solidity
function getPlatformHash() external view override returns (bytes32);
```

**Returns:**
- Platform identifier for this treasury

#### Get Platform Fee Percent

```solidity
function getPlatformFeePercent() external view override returns (uint256);
```

**Returns:**
- Platform fee percentage in basis points

### Fee Distribution

#### Disburse Fees

```solidity
function disburseFees()
    public
    virtual
    override
    whenCampaignNotPaused
    whenCampaignNotCancelled;
```

**Effects:**
- Checks success condition (must be met)
- Calculates protocol and platform fee shares
- Transfers protocol fee to protocol admin
- Transfers platform fee to platform admin
- Marks fees as disbursed
- Emits `FeesDisbursed` event

**Requirements:**
- Campaign must not be paused or cancelled
- Success condition must be met
- Implementation must override `_checkSuccessCondition()`

**Calculation:**
```solidity
protocolShare = (balance * protocolFeePercent) / 10000
platformShare = (balance * platformFeePercent) / 10000
```

#### Success Condition Check

```solidity
function _checkSuccessCondition() internal view virtual returns (bool);
```

**Returns:**
- True if campaign succeeded, false otherwise

**Note:** Must be overridden by implementing contracts
- **AllOrNothing**: Returns `totalRaised >= goal`
- **KeepWhatsRaised**: Always returns `true`

### Withdrawal

#### Withdraw

```solidity
function withdraw()
    public
    virtual
    override
    whenCampaignNotPaused
    whenCampaignNotCancelled;
```

**Effects:**
- Transfers all remaining funds to campaign owner
- Requires fees to be disbursed first
- Emits `WithdrawalSuccessful` event

**Requirements:**
- Only callable by campaign owner
- Campaign must not be paused or cancelled
- Fees must be disbursed

### Modifiers

#### When Campaign Not Paused

```solidity
modifier whenCampaignNotPaused();
```

**Effect:** Reverts if campaign is paused

#### When Campaign Not Cancelled

```solidity
modifier whenCampaignNotCancelled();
```

**Effect:** Reverts if campaign is cancelled

## Events

### FeesDisbursed

```solidity
event FeesDisbursed(uint256 protocolShare, uint256 platformShare);
```

**Emitted when:** Fees successfully distributed
**Includes:** Amounts sent to protocol and platform

### WithdrawalSuccessful

```solidity
event WithdrawalSuccessful(address to, uint256 amount);
```

**Emitted when:** Campaign owner withdraws funds

### SuccessConditionNotFulfilled

```solidity
event SuccessConditionNotFulfilled();
```

**Emitted when:** Attempt to disburse fees on unsuccessful campaign

## Errors

### TreasuryTransferFailed

```solidity
error TreasuryTransferFailed();
```

**Emitted when:** Token transfer fails

### TreasurySuccessConditionNotFulfilled

```solidity
error TreasurySuccessConditionNotFulfilled();
```

**Emitted when:** Attempting to disburse fees on failed campaign

### TreasuryFeeNotDisbursed

```solidity
error TreasuryFeeNotDisbursed();
```

**Emitted when:** Attempting to withdraw before fees disbursed

### TreasuryCampaignInfoIsPaused

```solidity
error TreasuryCampaignInfoIsPaused();
```

**Emitted when:** Campaign is paused

## Usage Examples

### Implementing a Custom Treasury

```solidity
contract CustomTreasury is BaseTreasury {
    // Custom state variables
    uint256 private s_customAmount;
    
    // Override initialization
    function initialize(
        bytes32 platformHash,
        address infoAddress,
        string calldata name,
        string calldata symbol
    ) external initializer {
        __BaseContract_init(platformHash, infoAddress);
        // Additional initialization
        s_customAmount = 0;
    }
    
    // Override success condition
    function _checkSuccessCondition() 
        internal 
        view 
        override 
        returns (bool) 
    {
        // Custom logic here
        return s_customAmount >= CUSTOM_THRESHOLD;
    }
    
    // Custom pledge function
    function customPledge(uint256 amount) external {
        // Update custom amount
        s_customAmount += amount;
        s_pledgedAmount += amount;
        
        // Transfer tokens
        TOKEN.safeTransferFrom(msg.sender, address(this), amount);
    }
}
```

### Fee Distribution Flow

```javascript
// 1. Check success condition
const isSuccessful = await treasury._checkSuccessCondition();
if (!isSuccessful) {
  throw new Error('Campaign did not reach goal');
}

// 2. Disburse fees
const tx1 = await treasury.disburseFees();
await tx1.wait();

// Listen for event
treasury.on('FeesDisbursed', (protocolShare, platformShare, event) => {
  console.log('Protocol fee:', ethers.utils.formatEther(protocolShare));
  console.log('Platform fee:', ethers.utils.formatEther(platformShare));
});

// 3. Campaign owner withdraws remaining funds
const tx2 = await treasury.withdraw();
await tx2.wait();

// Listen for event
treasury.on('WithdrawalSuccessful', (to, amount, event) => {
  console.log('Owner withdrew:', ethers.utils.formatEther(amount));
});
```

### Campaign State Checks

```javascript
// Check if campaign is paused
const isPaused = await campaign.paused();
if (isPaused) {
  console.log('Campaign is paused');
}

// Check if campaign is cancelled
const isCancelled = await campaign.cancelled();
if (isCancelled) {
  console.log('Campaign is cancelled');
}

// Check if fees disbursed
const feesDisbursed = await treasury.getFeesDisbursed();
console.log('Fees disbursed:', feesDisbursed);
```

## Security Considerations

### Safe Token Transfers

- Uses `SafeERC20` for all token transfers
- Prevents silent failures
- Provides descriptive error messages

### Access Control

- Campaign owner only for withdrawal
- Success condition must be met before fee distribution
- Paused/cancelled campaigns cannot disburse fees or withdraw

### Fee Calculation

- Fee percentages stored in basis points (1/10000)
- Precise integer math, no rounding errors
- Percentages are immutable once set

### State Protection

- Fees can only be disbursed once
- Withdrawal requires fees to be disbursed
- Campaign state checked before all operations

## Integration Notes

### With CampaignInfo

```javascript
// Treasury reads campaign state
const goal = await campaign.getGoalAmount();
const totalRaised = await campaign.getTotalRaisedAmount();
const launchTime = await campaign.getLaunchTime();
const deadline = await campaign.getDeadline();

// Treasury checks if campaign is active
const isPaused = await campaign.paused();
const isCancelled = await campaign.cancelled();
```

### With GlobalParams

```javascript
// Treasury uses fee configuration
const protocolFee = await globalParams.getProtocolFeePercent();
const platformFee = await globalParams.getPlatformFeePercent(platformHash);

// Calculate fee amounts
const protocolShare = (balance * protocolFee) / 10000;
const platformShare = (balance * platformFee) / 10000;
```

### Inheritance Pattern

```solidity
// All treasury types inherit from BaseTreasury
contract AllOrNothing is BaseTreasury, ERC721Burnable {
    // Custom pledge logic
    function pledgeForAReward(...) external { ... }
    
    // Override success condition
    function _checkSuccessCondition() 
        internal 
        view 
        override 
        returns (bool) 
    {
        return getTotalPledged() >= getGoal();
    }
}
```

## Best Practices

### Custom Success Conditions

```solidity
// Define clear, testable success conditions
function _checkSuccessCondition() 
    internal 
    view 
    override 
    returns (bool) 
{
    // Use descriptive variable names
    uint256 totalRaised = s_pledgedAmount;
    uint256 fundingGoal = INFO.getGoalAmount();
    
    // Make condition explicit
    bool goalReached = totalRaised >= fundingGoal;
    
    return goalReached;
}
```

### State Management

- Always check if fees are disbursed before withdrawal
- Track pledge amounts correctly
- Update state before external calls (CEI pattern)

### Error Handling

- Use descriptive error messages
- Check all preconditions
- Emit events for all state changes

## Abstract Function Requirements

### Must Override

```solidity
// This function MUST be overridden by implementation
function _checkSuccessCondition() 
    internal 
    view 
    virtual 
    returns (bool);
```

**Purpose:** Define funding model success criteria
**Examples:**
- AllOrNothing: Checks if total >= goal
- KeepWhatsRaised: Always returns true

### Optional Override

```solidity
// Can override for custom behavior
function disburseFees() public virtual override;
function withdraw() public virtual override;
```

**Consider overriding when:**
- Custom fee calculations needed
- Different withdrawal logic required
- Additional state tracking necessary

## Next Steps

- [AllOrNothing](./all-or-nothing.md) - Implementation example
- [KeepWhatsRaised](./keep-whats-raised.md) - Alternative funding model
- [CampaignAccessChecker](./campaign-access-checker.md) - Access control utilities
- [PausableCancellable](./pausable-cancellable.md) - State management utilities

