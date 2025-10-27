# TimestampChecker

The `TimestampChecker` is an abstract utility contract that provides timestamp-based validation for time-sensitive operations. It's used throughout the protocol to ensure functions are called at the correct times.

## Overview

```solidity
abstract contract TimestampChecker {
    modifier currentTimeIsGreater(uint256 inputTime);
    modifier currentTimeIsLess(uint256 inputTime);
    modifier currentTimeIsWithinRange(uint256 initialTime, uint256 finalTime);
    
    function _revertIfCurrentTimeIsNotLess(uint256 inputTime) internal view;
    function _revertIfCurrentTimeIsNotGreater(uint256 inputTime) internal view;
    function _revertIfCurrentTimeIsNotWithinRange(uint256 initialTime, uint256 finalTime) internal view;
}
```

## Purpose

- **Time Validation**: Ensure operations occur at correct times
- **Campaign Launches**: Verify campaign hasn't launched yet
- **Deadlines**: Verify campaign hasn't ended
- **Time Windows**: Validate operations within time ranges
- **Gas Efficient**: Simple timestamp comparisons

## Modifiers

### Current Time Is Greater

```solidity
modifier currentTimeIsGreater(uint256 inputTime);
```

**Effect:**
- Reverts if current time is less than or equal to input time
- Used when time must have passed

**Example:**
```solidity
function withdrawAfter(uint256 deadline) 
    external 
    currentTimeIsGreater(deadline) 
{
    // Can only call after deadline
}
```

### Current Time Is Less

```solidity
modifier currentTimeIsLess(uint256 inputTime);
```

**Effect:**
- Reverts if current time is greater than or equal to input time
- Used when operation must happen before time

**Example:**
```solidity
function updateGoal(uint256 goal) 
    external 
    currentTimeIsLess(launchTime) 
{
    // Can only update before launch
}
```

### Current Time Is Within Range

```solidity
modifier currentTimeIsWithinRange(uint256 initialTime, uint256 finalTime);
```

**Effect:**
- Reverts if current time is less than initialTime or greater than finalTime
- Used for operations within specific time windows

**Example:**
```solidity
function pledge() 
    external 
    currentTimeIsWithinRange(launchTime, deadline) 
{
    // Can only pledge during active campaign
}
```

## Internal Functions

### Revert If Current Time Is Not Less

```solidity
function _revertIfCurrentTimeIsNotLess(uint256 inputTime) internal view virtual;
```

**Effect:**
- Reverts with `CurrentTimeIsGreater` error if current time is greater than or equal to input time
- Used internally by `currentTimeIsLess` modifier

### Revert If Current Time Is Not Greater

```solidity
function _revertIfCurrentTimeIsNotGreater(uint256 inputTime) internal view virtual;
```

**Effect:**
- Reverts with `CurrentTimeIsLess` error if current time is less than or equal to input time
- Used internally by `currentTimeIsGreater` modifier

### Revert If Current Time Is Not Within Range

```solidity
function _revertIfCurrentTimeIsNotWithinRange(
    uint256 initialTime,
    uint256 finalTime
) internal view virtual;
```

**Effect:**
- Reverts with `CurrentTimeIsNotWithinRange` error if not in range
- Used internally by `currentTimeIsWithinRange` modifier

## Errors

### CurrentTimeIsGreater

```solidity
error CurrentTimeIsGreater(uint256 inputTime, uint256 currentTime);
```

**Thrown when:** Current time is greater than expected (too late)
**Includes:** Expected time and actual current time

### CurrentTimeIsLess

```solidity
error CurrentTimeIsLess(uint256 inputTime, uint256 currentTime);
```

**Thrown when:** Current time is less than expected (too early)
**Includes:** Expected time and actual current time

### CurrentTimeIsNotWithinRange

```solidity
error CurrentTimeIsNotWithinRange(uint256 initialTime, uint256 finalTime);
```

**Thrown when:** Current time is outside the allowed range
**Includes:** Start and end times of the range

## Usage Examples

### Campaign Launch Time Validation

```solidity
contract CampaignInfo is TimestampChecker {
    uint256 private s_launchTime;
    
    function updateLaunchTime(uint256 newLaunchTime) 
        external 
        currentTimeIsLess(getLaunchTime()) 
    {
        s_launchTime = newLaunchTime;
    }
}
```

### Deadline Enforcement

```solidity
contract Treasury is TimestampChecker {
    function pledge() 
        external 
        currentTimeIsWithinRange(launchTime, deadline) 
    {
        // Can only pledge during active campaign
    }
    
    function withdraw() 
        external 
        currentTimeIsGreater(deadline) 
    {
        // Can only withdraw after campaign ends
    }
}
```

### Pre-Launch Updates

```javascript
// Update campaign parameters before launch
const currentTime = Math.floor(Date.now() / 1000);
const launchTime = await campaign.getLaunchTime();

// Check if still before launch
// eslint-disable-next-line
if (currentTime < launchTime) {
  await campaign.updateGoal(newGoal); // ✓ Allowed
} else {
  console.log('Cannot update - campaign already launched');
}
```

### Pledge Window Check

```javascript
const campaignInfo = await treasury.getCampaignInfo();
const launchTime = await campaignInfo.getLaunchTime();
const deadline = await campaignInfo.getDeadline();

// Check if within pledge window
const now = Math.floor(Date.now() / 1000);
// eslint-disable-next-line
if (now >= launchTime && now <= deadline) {
  await treasury.pledgeForAReward(rewardName, amount, shippingFee); // ✓ Allowed
} else {
  console.log('Campaign is not active');
}
```

## Integration

### With CampaignInfo

```javascript
// Campaign uses timestamp checkers for pre-launch updates
const updateLaunchTime = async (newLaunchTime) => {
  try {
    await campaign.updateLaunchTime(newLaunchTime, {
      // Must be called before current launch time
    });
  } catch (error) {
    if (error.message.includes('CurrentTimeIsGreater')) {
      console.log('Too late - campaign already launched');
    }
  }
};

const updateDeadline = async (newDeadline) => {
  try {
    await campaign.updateDeadline(newDeadline, {
      // Must be called before current launch time
    });
  } catch (error) {
    if (error.message.includes('CurrentTimeIsGreater')) {
      console.log('Too late - cannot update deadline');
    }
  }
};
```

### With Treasury

```javascript
// Treasury uses timestamp checkers for pledge window
const pledge = async (rewardName, amount) => {
  const campaignInfo = await treasury.getCampaignInfo();
  const launchTime = await campaignInfo.getLaunchTime();
  const deadline = await campaignInfo.getDeadline();
  
  // Can only pledge during active window
  const now = Math.floor(Date.now() / 1000);
  // eslint-disable-next-line
  if (now < launchTime) {
    console.log('Too early - campaign not launched yet');
    return;
  }
  
  // eslint-disable-next-line
  if (now > deadline) {
    console.log('Too late - campaign ended');
    return;
  }
  
  await treasury.pledgeForAReward(rewardName, amount, 0);
};
```

## Security Considerations

### Timestamp Manipulation

- Uses `block.timestamp` which miners can manipulate slightly
- 15-second tolerance is typical
- Use relative times when possible

### Front-Running

- Timestamps prevent certain operations
- Can't be bypassed by transaction ordering
- Provides natural protection for state changes

### Timezone Independence

- All timestamps in Unix epoch seconds
- No timezone considerations needed
- Clear, universal time reference

## Best Practices

### Define Clear Time Windows

```solidity
// Good: Clear time bounds
modifier onlyDuringCampaign() {
    _revertIfCurrentTimeIsNotWithinRange(launchTime, deadline);
    _;
}

// Bad: Ambiguous timing
modifier someTimeAfter() {
    // Too vague
}
```

### Test Time-Based Logic

```javascript
// Test with various timestamps
const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour ahead

// Test before launch
await increaseTime(pastTime - currentTime);
await expect(campaign.updateGoal(newGoal)).to.be.reverted;

// Test after launch
await increaseTime(futureTime - currentTime);
await expect(treasury.withdraw()).to.succeed;
```

### Handle Edge Cases

```javascript
// Always check current state
const now = Math.floor(Date.now() / 1000);
const deadline = await campaign.getDeadline();

// eslint-disable-next-line
if (now <= deadline) {
  // Still active, can pledge
  await treasury.pledge(amount);
} else {
  // Ended, check if successful
  const isSuccessful = await treasury.checkSuccessCondition();
  if (isSuccessful) {
    await treasury.withdraw();
  } else {
    await treasury.claimRefund(tokenId);
  }
}
```

## Next Steps

- [CampaignInfo](./campaign-info.md) - Uses timestamp validation
- [AllOrNothing](./all-or-nothing.md) - Enforces pledge windows
- [PausableCancellable](./pausable-cancellable.md) - Additional state controls

