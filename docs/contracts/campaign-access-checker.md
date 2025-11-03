# CampaignAccessChecker

The `CampaignAccessChecker` is an abstract utility contract that provides campaign-specific access control. It extends admin access control with campaign owner permissions.

## Overview

```solidity
abstract contract CampaignAccessChecker {
    ICampaignInfo internal INFO;
    
    error AccessCheckerUnauthorized();
    
    function __CampaignAccessChecker_init(address campaignInfo) internal;
    modifier onlyProtocolAdmin();
    modifier onlyPlatformAdmin(bytes32 platformHash);
    modifier onlyCampaignOwner();
}
```

## Purpose

- **Campaign Owner Access**: Restricts functions to campaign owners
- **Protocol Admin Access**: Restricts functions to protocol administrators  
- **Platform Admin Access**: Restricts functions to platform-specific admins
- **Campaign-Specific**: Uses ICampaignInfo for campaign context
- **Reusable**: Can be inherited by treasury and other campaign contracts

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `INFO` | `ICampaignInfo` | Reference to campaign info contract |

## Functions

### Initialization

#### Init Campaign Access Checker

```solidity
function __CampaignAccessChecker_init(address campaignInfo) internal;
```

**Parameters:**
- `campaignInfo`: CampaignInfo contract address

**Effects:**
- Stores reference to CampaignInfo
- Enables access control checks

**Called by:**
- BaseTreasury and derived contracts
- Any contract needing campaign access control

### Modifiers

#### Only Campaign Owner

```solidity
modifier onlyCampaignOwner();
```

**Effect:**
- Restricts function to campaign owner only
- Reverts with `AccessCheckerUnauthorized` if caller is not owner

**Usage:**
```solidity
function updateGoal(uint256 newGoal) external onlyCampaignOwner {
    // Only campaign owner can call
}
```

#### Only Protocol Admin

```solidity
modifier onlyProtocolAdmin();
```

**Effect:**
- Restricts function to protocol admin only
- Queries CampaignInfo for protocol admin address

#### Only Platform Admin

```solidity
modifier onlyPlatformAdmin(bytes32 platformHash);
```

**Parameters:**
- `platformHash`: Platform identifier

**Effect:**
- Restricts function to specific platform's admin
- Queries CampaignInfo for platform admin address

## Errors

### AccessCheckerUnauthorized

```solidity
error AccessCheckerUnauthorized();
```

**Thrown when:** Caller is not authorized
**Conditions:**
- Not campaign owner when `onlyCampaignOwner` used
- Not protocol admin when `onlyProtocolAdmin` used  
- Not platform admin when `onlyPlatformAdmin` used

## Usage Examples

### Inheriting the Contract

```solidity
contract CampaignTreasury is CampaignAccessChecker {
    function initialize(address campaignInfo) external {
        __CampaignAccessChecker_init(campaignInfo);
    }
    
    function ownerFunction() external onlyCampaignOwner {
        // Only campaign owner can call
    }
    
    function adminFunction() external onlyProtocolAdmin {
        // Only protocol admin can call
    }
}
```

### Campaign Owner Functions

```javascript
// Get campaign owner
const owner = await campaign.owner();
console.log('Campaign Owner:', owner);

// Call owner-only function
try {
  await treasury.ownerFunction();
} catch (error) {
  if (error.message.includes('AccessCheckerUnauthorized')) {
    console.log('Not authorized - only owner can call');
  }
}
```

### Access Control Hierarchy

```javascript
// Campaign owner has most permissions
await treasury.updateReward(rewardName, newReward); // ✓

// Protocol admin can pause/cancel
await campaign._pauseCampaign(reason); // ✓

// Platform admin manages platform settings
await treasury.updatePlatformSettings(); // ✓
```

## Integration

### With BaseTreasury

```solidity
abstract contract BaseTreasury is CampaignAccessChecker {
    function __BaseContract_init(address campaignInfo) internal {
        __CampaignAccessChecker_init(campaignInfo);
    }
    
    // Campaign owner can withdraw
    function withdraw() external onlyCampaignOwner {
        // Withdrawal logic
    }
}
```

### With CampaignInfo

```javascript
// CampaignInfo provides admin addresses
const protocolAdmin = await campaign.getProtocolAdminAddress();
const campaignOwner = await campaign.owner();

// Check if caller is authorized
const isOwner = msg.sender === campaignOwner;
const isProtocolAdmin = msg.sender === protocolAdmin;
```

## Security Considerations

### Campaign-Scoped Access

- Access control is scoped to specific campaign
- Campaign owner cannot access other campaigns
- Platform admin scoped to their platform

### Ownership Transfer

- Campaign ownership can be transferred
- New owner inherits all permissions
- Previous owner loses access

### Admin Separation

- Protocol admin ≠ Platform admin ≠ Campaign owner
- Clear separation of responsibilities
- No overlap in permissions

## Best Practices

### Check Ownership Before Operations

```javascript
// Frontend should check ownership
const isOwner = await campaign.owner() === currentUser;
if (!isOwner) {
  disableOwnerFunctions();
}
```

### Error Handling

```javascript
try {
  await treasury.ownerFunction();
} catch (error) {
  if (error.message.includes('AccessCheckerUnauthorized')) {
    showError('Only campaign owner can perform this action');
  }
}
```

## Next Steps

- [AdminAccessChecker](./admin-access-checker.md) - Protocol-level access control
- [PausableCancellable](./pausable-cancellable.md) - State management utilities
- [BaseTreasury](./base-treasury.md) - Uses campaign access control




