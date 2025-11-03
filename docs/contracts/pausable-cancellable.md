# PausableCancellable

The `PausableCancellable` is an abstract utility contract that provides pause and cancel functionality for emergency controls and state management in campaigns and treasuries.

## Overview

```solidity
abstract contract PausableCancellable {
    bool private _paused;
    bool private _cancelled;
    
    event Paused(address indexed account, bytes32 reason);
    event Unpaused(address indexed account, bytes32 reason);
    event Cancelled(address indexed account, bytes32 reason);
    
    modifier whenNotPaused();
    modifier whenPaused();
    modifier whenNotCancelled();
    modifier whenCancelled();
    
    function paused() public view virtual returns (bool);
    function cancelled() public view virtual returns (bool);
    function _pause(bytes32 reason) internal virtual;
    function _unpause(bytes32 reason) internal virtual;
    function _cancel(bytes32 reason) internal virtual;
}
```

## Purpose

- **Emergency Controls**: Allow pausing campaigns in emergencies
- **Cancellation Support**: Permanent cancellation capability
- **State Management**: Track paused and cancelled states
- **Reusable**: Can be inherited by any contract needing these states
- **Safe Defaults**: Prevents operations when paused/cancelled

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `_paused` | `bool` | Whether contract is paused |
| `_cancelled` | `bool` | Whether contract is cancelled |

## Functions

### State Queries

#### Paused

```solidity
function paused() public view virtual returns (bool);
```

**Returns:**
- True if contract is paused

#### Cancelled

```solidity
function cancelled() public view virtual returns (bool);
```

**Returns:**
- True if contract is cancelled

### State Management

#### Pause

```solidity
function _pause(bytes32 reason) internal virtual;
```

**Parameters:**
- `reason`: Reason for pausing

**Effects:**
- Sets `_paused` to true
- Emits `Paused` event
- Stops most operations

**Requirements:**
- Contract must not be paused
- Contract must not be cancelled

#### Unpause

```solidity
function _unpause(bytes32 reason) internal virtual;
```

**Parameters:**
- `reason`: Reason for unpausing

**Effects:**
- Sets `_paused` to false
- Emits `Unpaused` event
- Resumes operations

**Requirements:**
- Contract must be paused

#### Cancel

```solidity
function _cancel(bytes32 reason) internal virtual;
```

**Parameters:**
- `reason`: Reason for cancellation

**Effects:**
- Sets `_cancelled` to true
- Unpauses if paused
- Emits `Cancelled` event
- Prevents future operations

**Requirements:**
- Contract must not be cancelled
- Cancellation is permanent and irreversible

## Modifiers

### When Not Paused

```solidity
modifier whenNotPaused();
```

**Effect:**
- Reverts if contract is paused
- Used on functions that should be disabled when paused

### When Paused

```solidity
modifier whenPaused();
```

**Effect:**
- Reverts if contract is not paused
- Used on functions that should only work when paused

### When Not Cancelled

```solidity
modifier whenNotCancelled();
```

**Effect:**
- Reverts if contract is cancelled
- Used on most functions to prevent operations

### When Cancelled

```solidity
modifier whenCancelled();
```

**Effect:**
- Reverts if contract is not cancelled
- Used on functions that should only work when cancelled

## Events

### Paused

```solidity
event Paused(address indexed account, bytes32 reason);
```

**Emitted when:** Contract is paused
**Includes:** Account that paused, reason for pausing

### Unpaused

```solidity
event Unpaused(address indexed account, bytes32 reason);
```

**Emitted when:** Contract is unpaused
**Includes:** Account that unpaused, reason

### Cancelled

```solidity
event Cancelled(address indexed account, bytes32 reason);
```

**Emitted when:** Contract is cancelled
**Includes:** Account that cancelled, reason

## Errors

### PausedError

```solidity
error PausedError();
```

**Thrown when:** Operation attempted while paused

### NotPausedError

```solidity
error NotPausedError();
```

**Thrown when:** Unpause attempted when not paused

### CancelledError

```solidity
error CancelledError();
```

**Thrown when:** Operation attempted when cancelled

### CannotCancel

```solidity
error CannotCancel();
```

**Thrown when:** Cancel attempted on already-cancelled contract

## Usage Examples

### Using State Modifiers

```solidity
contract MyContract is PausableCancellable {
    // Only works when not paused/cancelled
    function normalFunction() external whenNotPaused whenNotCancelled {
        // Implementation
    }
    
    // Only works when paused
    function emergencyFunction() external whenPaused {
        // Implementation
    }
    
    // Only works when cancelled
    function cleanupFunction() external whenCancelled {
        // Implementation
    }
}
```

### Checking State

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

// Only proceed if active
if (!isPaused && !isCancelled) {
  await treasury.pledge(amount);
}
```

### Emergency Pause

```javascript
// Protocol admin pauses campaign
const reason = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('security-issue'));
await campaign._pauseCampaign(reason);

// All operations now fail
try {
  await treasury.pledge(amount);
} catch (error) {
  console.log('Campaign is paused');
}

// Unpause when issue resolved
const unpauseReason = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('issue-resolved')
);
await campaign._unpauseCampaign(unpauseReason);
```

### Cancellation

```javascript
// Cancel campaign permanently
const reason = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('owner-request'));
await campaign._cancelCampaign(reason);

// All operations now fail
try {
  await treasury.pledge(amount);
} catch (error) {
  console.log('Campaign is cancelled');
}

// Cancellation cannot be reversed
// Campaign is permanently ended
```

## Integration

### With CampaignInfo

```solidity
contract CampaignInfo is PausableCancellable {
    function _pauseCampaign(bytes32 message) 
        external 
        onlyProtocolAdmin 
    {
        _pause(message);
    }
    
    function _unpauseCampaign(bytes32 message) 
        external 
        onlyProtocolAdmin 
    {
        _unpause(message);
    }
    
    function _cancelCampaign(bytes32 message) 
        external 
    {
        // Only owner or protocol admin
        _cancel(message);
    }
}
```

### With BaseTreasury

```solidity
abstract contract BaseTreasury is PausableCancellable {
    modifier whenCampaignNotPaused() {
        _revertIfCampaignPaused();
        _;
    }
    
    modifier whenCampaignNotCancelled() {
        _revertIfCampaignCancelled();
        _;
    }
    
    function pledge() external whenNotPaused whenNotCancelled {
        // Only works when active
    }
}
```

## State Transitions

### Paused

```
Active → Paused (via _pause)
Paused → Active (via _unpause)
Paused → Cancelled (via _cancel, auto-unpauses)
```

### Cancelled

```
Active → Cancelled (via _cancel)
Paused → Cancelled (via _cancel, auto-unpauses)
Cancelled → [No transitions possible - permanent]
```

## Security Considerations

### Permanent Cancellation

- Cancellation is irreversible
- No way to recover from cancelled state
- All operations permanently disabled
- Use only when absolutely necessary

### Pause vs Cancel

- **Pause**: Temporary, can be unpaused
- **Cancel**: Permanent, cannot be undone
- Choose carefully which to use

### Access Control

- Only authorized accounts can pause/unpause/cancel
- Typically protocol admins can pause
- Campaign owners or protocol admins can cancel

## Best Practices

### Use Clear Reasons

```javascript
const pauseReason = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('exploit-detected-dec-2024')
);

await campaign._pauseCampaign(pauseReason);

// Log reason off-chain for audit trail
await database.logPause(reason, timestamp);
```

### Monitor State Changes

```javascript
campaign.on('Paused', (account, reason, event) => {
  console.log('Campaign paused by:', account);
  console.log('Reason:', ethers.utils.toUtf8String(reason));
  
  // Send alert
  sendAlertToUsers('Campaign paused due to emergency');
});

campaign.on('Cancelled', (account, reason, event) => {
  console.log('Campaign cancelled by:', account);
  
  // Update database
  await database.markCampaignCancelled(campaignAddress);
});
```

### Frontend State Checks

```javascript
// Always check state before operations
const isPaused = await campaign.paused();
const isCancelled = await campaign.cancelled();

if (isPaused || isCancelled) {
  showMessage('Campaign is not accepting contributions');
  disableInteraction();
  return;
}

// Proceed with operation
await treasury.pledge(amount);
```

## Next Steps

- [CampaignAccessChecker](./campaign-access-checker.md) - Access control using this state
- [BaseTreasury](./base-treasury.md) - Uses these modifiers
- [CampaignInfo](./campaign-info.md) - Implements pause/cancel functionality




