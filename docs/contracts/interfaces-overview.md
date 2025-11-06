# Interfaces Overview

Oak Network uses a comprehensive set of interfaces that define the contracts' external APIs. This section provides a reference for all interfaces in the protocol.

## Available Interfaces

### Core Protocol Interfaces

- **[ICampaignInfo](#icampaigninfo)** - Campaign management interface
- **[ICampaignInfoFactory](#icampaigninfofactory)** - Factory interface
- **[IGlobalParams](#iglobalparams)** - Protocol configuration interface
- **[ICampaignTreasury](#icampaigntreasury)** - Treasury operations interface
- **[ITreasuryFactory](#itreasuryfactory)** - Treasury factory interface

### Reward and Item Interfaces

- **[IReward](#ireward)** - Reward system interface
- **[IItem](#iitem)** - Item management interface
- **[ICampaignData](#icampaigndata)** - Campaign data structures

## ICampaignInfo

The main interface for campaign information and management.

**Functions:**
- `owner()` - Get campaign owner
- `getLaunchTime()` - Get launch timestamp
- `getDeadline()` - Get campaign deadline
- `getGoalAmount()` - Get funding goal
- `getTokenAddress()` - Get campaign token
- `getProtocolFeePercent()` - Get protocol fee
- `checkIfPlatformSelected()` - Check platform selection
- `getPlatformFeePercent()` - Get platform fee
- `getTotalRaisedAmount()` - Get total raised
- `paused()` - Check if paused
- `cancelled()` - Check if cancelled

## ICampaignInfoFactory

Interface for the campaign factory contract.

**Functions:**
- `createCampaign()` - Create new campaign
- `updateImplementation()` - Update implementation
- `isValidCampaignInfo()` - Validate campaign

## IGlobalParams

Interface for global protocol parameters.

**Functions:**
- `getProtocolAdminAddress()` - Get protocol admin
- `getTokenAddress()` - Get default token
- `getProtocolFeePercent()` - Get protocol fee
- `checkIfPlatformIsListed()` - Check platform listing
- `getPlatformAdminAddress()` - Get platform admin
- `getPlatformFeePercent()` - Get platform fee
- `getNumberOfListedPlatforms()` - Get platform count

## ICampaignTreasury

Interface for treasury operations.

**Functions:**
- `getPlatformHash()` - Get platform identifier
- `getPlatformFeePercent()` - Get platform fee
- `disburseFees()` - Distribute fees
- `withdraw()` - Withdraw funds

## ITreasuryFactory

Interface for treasury deployment.

**Functions:**
- `registerTreasuryImplementation()` - Register implementation
- `approveTreasuryImplementation()` - Approve implementation
- `disapproveTreasuryImplementation()` - Disapprove implementation
- `removeTreasuryImplementation()` - Remove implementation
- `deploy()` - Deploy treasury
- `getTreasuryAddress()` - Get implementation address

## IReward

Interface for reward management.

**Functions:**
- `getReward()` - Get reward details
- `addRewards()` - Add rewards
- `removeReward()` - Remove reward
- `getAllRewards()` - Get all rewards

## IItem

Interface for item registry.

**Functions:**
- `getItem()` - Get item details
- `addItem()` - Add item to registry

## ICampaignData

Data structure interface for campaign information.

**Structs:**
- `CampaignData` - Launch time, deadline, goal amount
- `Config` - Treasury factory, token, fee, identifier
- `Reward` - Reward configuration

## Usage

Interfaces are used for:

- **Type Safety** - Ensure contracts implement required functions
- **Integration** - Interact with contracts through defined interfaces
- **Upgradeability** - Allow implementation changes while keeping interface
- **Testing** - Mock contract behavior in tests

## Best Practices

### Using Interfaces for Integration

```javascript
// Import interface
import { ICampaignInfo } from './interfaces/ICampaignInfo';

// Use interface for type checking
async function getCampaignInfo(address: string): Promise<ICampaignInfo> {
  return await ethers.getContractAt('ICampaignInfo', address);
}

// Type-safe function calls
const campaign = await getCampaignInfo(campaignAddress);
const goal = await campaign.getGoalAmount(); // Type-safe!
```

### Interface-Based Development

```javascript
// Define interface in TypeScript for frontend
interface ICampaignInfo {
  owner(): Promise<Address>;
  getLaunchTime(): Promise<number>;
  getDeadline(): Promise<number>;
  getGoalAmount(): Promise<BigNumber>;
  getTotalRaisedAmount(): Promise<BigNumber>;
  paused(): Promise<boolean>;
  cancelled(): Promise<boolean>;
}
```

## Next Steps

For detailed documentation of each contract that implements these interfaces:

- [CampaignInfo](./campaign-info.md) - Implements ICampaignInfo
- [CampaignInfoFactory](./campaign-info-factory.md) - Implements ICampaignInfoFactory
- [GlobalParams](./global-params.md) - Implements IGlobalParams
- [TreasuryFactory](./treasury-factory.md) - Implements ITreasuryFactory
- [AllOrNothing](./all-or-nothing.md) - Implements ICampaignTreasury and IReward





