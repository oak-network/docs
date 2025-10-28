# AdminAccessChecker

The `AdminAccessChecker` is an abstract utility contract that provides protocol and platform-level access control. It's used by contracts that need to restrict certain functions to authorized administrators.

## Overview

```solidity
abstract contract AdminAccessChecker {
    IGlobalParams internal GLOBAL_PARAMS;
    
    error AdminAccessCheckerUnauthorized();
    
    function __AccessChecker_init(IGlobalParams globalParams) internal;
    modifier onlyProtocolAdmin();
    modifier onlyPlatformAdmin(bytes32 platformHash);
}
```

## Purpose

- **Protocol Admin Access**: Restricts functions to protocol administrators
- **Platform Admin Access**: Restricts functions to platform-specific admins
- **Centralized Authorization**: Uses GlobalParams for single source of truth
- **Gas Efficient**: Simple address comparison checks
- **Reusable**: Can be inherited by any contract needing admin access

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `GLOBAL_PARAMS` | `IGlobalParams` | Reference to global parameters contract |

## Functions

### Initialization

#### Init Access Checker

```solidity
function __AccessChecker_init(IGlobalParams globalParams) internal;
```

**Parameters:**
- `globalParams`: GlobalParams contract address

**Effects:**
- Stores reference to GlobalParams
- Enables access control checks

**Called by:**
- Factory contracts (TreasuryFactory, CampaignInfoFactory)
- Any contract needing admin access

### Modifiers

#### Only Protocol Admin

```solidity
modifier onlyProtocolAdmin();
```

**Effect:**
- Restricts function to protocol admin only
- Reverts with `AdminAccessCheckerUnauthorized` if caller is not protocol admin

**Usage:**
```solidity
function pauseCampaign() external onlyProtocolAdmin {
    // Only protocol admin can call
}
```

#### Only Platform Admin

```solidity
modifier onlyPlatformAdmin(bytes32 platformHash);
```

**Parameters:**
- `platformHash`: Platform identifier

**Effect:**
- Restricts function to specific platform's admin
- Reverts if caller is not platform admin

**Usage:**
```solidity
function updatePlatformSettings(bytes32 platformHash) 
    external 
    onlyPlatformAdmin(platformHash) 
{
    // Only that platform's admin can call
}
```

## Errors

### AdminAccessCheckerUnauthorized

```solidity
error AdminAccessCheckerUnauthorized();
```

**Thrown when:** Caller is not authorized admin
**Conditions:**
- Not protocol admin when `onlyProtocolAdmin` used
- Not platform admin when `onlyPlatformAdmin` used

## Usage Examples

### Inheriting the Contract

```solidity
contract MyContract is AdminAccessChecker {
    function initialize(IGlobalParams globalParams) external {
        __AccessChecker_init(globalParams);
    }
    
    function adminFunction() external onlyProtocolAdmin {
        // Only protocol admin can call
    }
    
    function platformFunction(bytes32 platformHash) 
        external 
        onlyPlatformAdmin(platformHash) 
    {
        // Only that platform's admin can call
    }
}
```

### Protocol Admin Functions

```javascript
// Get protocol admin address
const protocolAdmin = await globalParams.getProtocolAdminAddress();
console.log('Protocol Admin:', protocolAdmin);

// Call protocol-admin-only function
try {
  await contract.protocolAdminFunction();
} catch (error) {
  if (error.message.includes('AdminAccessCheckerUnauthorized')) {
    console.log('Not authorized - only protocol admin can call');
  }
}
```

### Platform Admin Functions

```javascript
// Get platform admin address
const platformHash = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('my-platform')
);
const platformAdmin = await globalParams.getPlatformAdminAddress(platformHash);
console.log('Platform Admin:', platformAdmin);

// Call platform-admin-only function
try {
  await contract.platformAdminFunction(platformHash);
} catch (error) {
  if (error.message.includes('AdminAccessCheckerUnauthorized')) {
    console.log('Not authorized - only platform admin can call');
  }
}
```

## Integration

### With TreasuryFactory

```solidity
contract TreasuryFactory is AdminAccessChecker {
    constructor(IGlobalParams globalParams) {
        __AccessChecker_init(globalParams);
    }
    
    // Only protocol admin can approve implementations
    function approveTreasuryImplementation(...) 
        external 
        onlyProtocolAdmin 
    { ... }
    
    // Only platform admin can register implementations
    function registerTreasuryImplementation(...) 
        external 
        onlyPlatformAdmin(platformHash) 
    { ... }
}
```

### With GlobalParams

```solidity
// AdminAccessChecker queries GlobalParams for admin addresses
function _onlyProtocolAdmin() private view {
    address protocolAdmin = GLOBAL_PARAMS.getProtocolAdminAddress();
    if (msg.sender != protocolAdmin) {
        revert AdminAccessCheckerUnauthorized();
    }
}

function _onlyPlatformAdmin(bytes32 platformHash) private view {
    address platformAdmin = GLOBAL_PARAMS.getPlatformAdminAddress(platformHash);
    if (msg.sender != platformAdmin) {
        revert AdminAccessCheckerUnauthorized();
    }
}
```

## Security Considerations

### Centralized Admin Management

- All admin addresses stored in GlobalParams
- Single source of truth
- Easy to update admin addresses
- Changes propagate to all contracts

### Access Control Hierarchy

- **Protocol Admin**: Can access all protocol-level functions
- **Platform Admin**: Can only access their platform's functions
- **Separation**: Clear isolation between platforms

### Gas Efficiency

- Simple address comparison
- No external calls during modifier execution
- Cached reference to GlobalParams

## Best Practices

### Multi-Sig for Admins

```javascript
// Use multi-sig for protocol admin
await globalParams.updateProtocolAdminAddress(multisigAddress);

// Use multi-sig for platform admins
await globalParams.updatePlatformAdminAddress(platformHash, multisigAddress);
```

### Regular Admin Updates

- Rotate admin keys regularly
- Document admin changes
- Monitor admin address updates

### Error Handling

```javascript
// Always check authorization in frontend
try {
  await contract.protocolAdminFunction();
} catch (error) {
  if (error.message.includes('AdminAccessCheckerUnauthorized')) {
    showError('Only protocol admin can perform this action');
  }
}
```

## Next Steps

- [CampaignAccessChecker](./campaign-access-checker.md) - Campaign-level access control
- [GlobalParams](./global-params.md) - Admin address management
- [PausableCancellable](./pausable-cancellable.md) - Emergency controls


