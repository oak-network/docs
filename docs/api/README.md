# Oak Network API Reference

This section provides comprehensive API documentation for all Oak Network smart contracts.

## 📋 Table of Contents

- [Core Contracts](#core-contracts)
- [Factory Contracts](#factory-contracts)
- [Treasury Contracts](#treasury-contracts)
- [Utility Contracts](#utility-contracts)
- [Interface Contracts](#interface-contracts)
- [Events](#events)
- [Error Codes](#error-codes)

## 🏗️ Core Contracts

### CampaignInfoFactory

Factory contract for creating and managing campaign instances.

**Address**: `0x...` (Mainnet) | `0x...` (Testnet)

#### Functions

##### `createCampaign`
```solidity
function createCampaign(
    string memory title,
    string memory description,
    uint256 goal,
    uint256 duration,
    string memory treasuryType
) external returns (address campaign)
```

Creates a new campaign with the specified parameters.

**Parameters:**
- `title` (string): Campaign title
- `description` (string): Campaign description
- `goal` (uint256): Funding goal in wei
- `duration` (uint256): Campaign duration in seconds
- `treasuryType` (string): Type of treasury ("AllOrNothing" or "KeepWhatsRaised")

**Returns:**
- `campaign` (address): Address of the created campaign contract

**Events:**
- `CampaignCreated(address indexed campaign, string title, uint256 goal)`

**Requirements:**
- Caller must have `CAMPAIGN_CREATOR_ROLE`
- Goal must be greater than 0
- Duration must be between 1 day and 1 year

##### `getCampaign`
```solidity
function getCampaign(uint256 campaignId) external view returns (address)
```

Retrieves the address of a campaign by its ID.

**Parameters:**
- `campaignId` (uint256): Unique campaign identifier

**Returns:**
- `address`: Campaign contract address

##### `getCampaignCount`
```solidity
function getCampaignCount() external view returns (uint256)
```

Returns the total number of campaigns created.

**Returns:**
- `uint256`: Total campaign count

### TreasuryFactory

Factory contract for deploying treasury contracts.

**Address**: `0x...` (Mainnet) | `0x...` (Testnet)

#### Functions

##### `createTreasury`
```solidity
function createTreasury(
    address campaign,
    string memory treasuryType
) external returns (address treasury)
```

Creates a new treasury contract for a campaign.

**Parameters:**
- `campaign` (address): Campaign contract address
- `treasuryType` (string): Type of treasury to create

**Returns:**
- `treasury` (address): Address of the created treasury contract

**Events:**
- `TreasuryCreated(address indexed treasury, address indexed campaign, string treasuryType)`

### GlobalParams

Manages protocol-wide parameters and configuration.

**Address**: `0x...` (Mainnet) | `0x...` (Testnet)

#### Functions

##### `setProtocolFee`
```solidity
function setProtocolFee(uint256 newFee) external
```

Sets the protocol fee percentage.

**Parameters:**
- `newFee` (uint256): New fee percentage (basis points, e.g., 100 = 1%)

**Requirements:**
- Caller must have `PROTOCOL_ADMIN_ROLE`
- Fee must be between 0 and 1000 basis points (0-10%)

##### `getProtocolFee`
```solidity
function getProtocolFee() external view returns (uint256)
```

Returns the current protocol fee percentage.

**Returns:**
- `uint256`: Protocol fee in basis points

## 🏦 Treasury Contracts

### AllOrNothing

Treasury contract that only releases funds if the goal is reached.

#### Functions

##### `pledge`
```solidity
function pledge(uint256 amount) external payable
```

Pledge funds to the campaign.

**Parameters:**
- `amount` (uint256): Amount to pledge in wei

**Requirements:**
- Campaign must be active
- Amount must be greater than 0
- Sufficient ETH must be sent

**Events:**
- `PledgeMade(address indexed backer, uint256 amount)`

##### `claimRefund`
```solidity
function claimRefund() external
```

Claims a refund if the campaign failed to reach its goal.

**Requirements:**
- Campaign must be ended
- Goal must not have been reached
- Caller must have pledged funds

**Events:**
- `RefundClaimed(address indexed backer, uint256 amount)`

##### `withdrawFunds`
```solidity
function withdrawFunds() external
```

Withdraws funds to the campaign creator if the goal was reached.

**Requirements:**
- Campaign must be ended
- Goal must have been reached
- Caller must be the campaign creator

**Events:**
- `FundsWithdrawn(address indexed creator, uint256 amount)`

### KeepWhatsRaised

Treasury contract that releases all raised funds regardless of goal achievement.

#### Functions

##### `pledge`
```solidity
function pledge(uint256 amount) external payable
```

Pledge funds to the campaign.

**Parameters:**
- `amount` (uint256): Amount to pledge in wei

**Requirements:**
- Campaign must be active
- Amount must be greater than 0
- Sufficient ETH must be sent

**Events:**
- `PledgeMade(address indexed backer, uint256 amount)`

##### `withdrawFunds`
```solidity
function withdrawFunds() external
```

Withdraws all raised funds to the campaign creator.

**Requirements:**
- Campaign must be ended
- Caller must be the campaign creator

**Events:**
- `FundsWithdrawn(address indexed creator, uint256 amount)`

## 🛠️ Utility Contracts

### AdminAccessChecker

Manages administrative access control.

#### Functions

##### `hasAdminAccess`
```solidity
function hasAdminAccess(address account) external view returns (bool)
```

Checks if an account has administrative access.

**Parameters:**
- `account` (address): Account to check

**Returns:**
- `bool`: True if account has admin access

### CampaignAccessChecker

Manages campaign-specific access control.

#### Functions

##### `hasCampaignAccess`
```solidity
function hasCampaignAccess(address account, address campaign) external view returns (bool)
```

Checks if an account has access to a specific campaign.

**Parameters:**
- `account` (address): Account to check
- `campaign` (address): Campaign contract address

**Returns:**
- `bool`: True if account has campaign access

### PausableCancellable

Provides pausing and cancellation functionality.

#### Functions

##### `pause`
```solidity
function pause() external
```

Pauses the contract.

**Requirements:**
- Caller must have `PAUSER_ROLE`
- Contract must not already be paused

**Events:**
- `Paused(address account)`

##### `unpause`
```solidity
function unpause() external
```

Unpauses the contract.

**Requirements:**
- Caller must have `PAUSER_ROLE`
- Contract must be paused

**Events:**
- `Unpaused(address account)`

##### `cancel`
```solidity
function cancel() external
```

Cancels the contract.

**Requirements:**
- Caller must have `CANCELLER_ROLE`
- Contract must not already be cancelled

**Events:**
- `Cancelled(address account)`

## 📡 Events

### Campaign Events

```solidity
event CampaignCreated(
    address indexed campaign,
    string title,
    uint256 goal,
    uint256 duration,
    address indexed creator
);

event CampaignEnded(
    address indexed campaign,
    bool goalReached,
    uint256 totalRaised
);

event CampaignCancelled(
    address indexed campaign,
    address indexed canceller
);
```

### Treasury Events

```solidity
event PledgeMade(
    address indexed backer,
    address indexed campaign,
    uint256 amount,
    uint256 totalPledged
);

event FundsWithdrawn(
    address indexed creator,
    address indexed campaign,
    uint256 amount
);

event RefundClaimed(
    address indexed backer,
    address indexed campaign,
    uint256 amount
);
```

### Access Control Events

```solidity
event RoleGranted(
    bytes32 indexed role,
    address indexed account,
    address indexed sender
);

event RoleRevoked(
    bytes32 indexed role,
    address indexed account,
    address indexed sender
);
```

## ❌ Error Codes

### Common Errors

```solidity
error CampaignNotFound(address campaign);
error CampaignNotActive(address campaign);
error CampaignEnded(address campaign);
error InsufficientFunds(uint256 required, uint256 available);
error InvalidAmount(uint256 amount);
error InvalidDuration(uint256 duration);
error UnauthorizedAccess(address account);
error ContractPaused();
error ContractCancelled();
error GoalNotReached(uint256 goal, uint256 raised);
error AlreadyRefunded(address backer);
error NoRefundAvailable(address backer);
```

### Access Control Errors

```solidity
error MissingRole(bytes32 role, address account);
error InvalidRole(bytes32 role);
error SelfRevoke(bytes32 role, address account);
```

## 🔗 Integration Examples

### Creating a Campaign

```javascript
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('https://forno.celo.org');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const campaignFactory = new ethers.Contract(
  CAMPAIGN_FACTORY_ADDRESS,
  CAMPAIGN_FACTORY_ABI,
  wallet
);

const tx = await campaignFactory.createCampaign(
  'My Amazing Campaign',
  'Help me build the future of crowdfunding',
  ethers.utils.parseEther('10'), // 10 CELO goal
  30 * 24 * 60 * 60, // 30 days
  'AllOrNothing'
);

const receipt = await tx.wait();
const campaignAddress = receipt.events[0].args.campaign;
```

### Pledging to a Campaign

```javascript
const treasury = new ethers.Contract(
  treasuryAddress,
  TREASURY_ABI,
  wallet
);

const tx = await treasury.pledge(
  ethers.utils.parseEther('1'), // 1 CELO pledge
  { value: ethers.utils.parseEther('1') }
);

await tx.wait();
```

### Checking Campaign Status

```javascript
const campaign = new ethers.Contract(
  campaignAddress,
  CAMPAIGN_ABI,
  provider
);

const isActive = await campaign.isActive();
const goal = await campaign.goal();
const raised = await campaign.totalRaised();
const timeLeft = await campaign.timeLeft();

console.log(`Campaign active: ${isActive}`);
console.log(`Goal: ${ethers.utils.formatEther(goal)} CELO`);
console.log(`Raised: ${ethers.utils.formatEther(raised)} CELO`);
console.log(`Time left: ${timeLeft} seconds`);
```

## 📊 Gas Estimates

| Function | Gas Cost (Approx.) |
|----------|-------------------|
| `createCampaign` | 500,000 |
| `createTreasury` | 300,000 |
| `pledge` | 100,000 |
| `withdrawFunds` | 80,000 |
| `claimRefund` | 60,000 |

*Gas costs are estimates and may vary based on network conditions.*

## 🔍 Contract Addresses

### Mainnet (Celo)

| Contract | Address |
|----------|---------|
| CampaignInfoFactory | `0x...` |
| TreasuryFactory | `0x...` |
| GlobalParams | `0x...` |
| AllOrNothing | `0x...` |
| KeepWhatsRaised | `0x...` |

### Testnet (Alfajores)

| Contract | Address |
|----------|---------|
| CampaignInfoFactory | `0x...` |
| TreasuryFactory | `0x...` |
| GlobalParams | `0x...` |
| AllOrNothing | `0x...` |
| KeepWhatsRaised | `0x...` |

---

**Need help?** Check our [integration guides](docs/guides/) or join our [Discord community](https://discord.gg/oaknetwork).


