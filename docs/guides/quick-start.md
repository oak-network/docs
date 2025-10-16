# Quick Start Guide

Get up and running with Oak Network in minutes. This guide will walk you through creating your first campaign and integrating with the protocol.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for cloning repositories
- **MetaMask** or similar wallet
- **Celo testnet tokens** for testing

## Installation

### 1. Install Dependencies

```bash
# Install ethers.js for blockchain interaction
npm install ethers

# Install additional utilities
npm install @openzeppelin/contracts
```

## Basic Setup

### 1. Connect to Celo Network

```javascript
import { ethers } from 'ethers';

// Connect to Celo testnet
const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Get contract addresses
const CAMPAIGN_FACTORY_ADDRESS = '0x...'; // Replace with actual address
const TREASURY_FACTORY_ADDRESS = '0x...'; // Replace with actual address
const GLOBAL_PARAMS_ADDRESS = '0x...'; // Replace with actual address
```

### 2. Initialize Contract Interfaces

```javascript
// Import contract ABIs (you'll need to get these from the contracts)
import CampaignFactoryABI from './abis/CampaignFactory.json';
import TreasuryFactoryABI from './abis/TreasuryFactory.json';
import GlobalParamsABI from './abis/GlobalParams.json';

// Initialize contract interfaces
const campaignFactory = new ethers.Contract(
  CAMPAIGN_FACTORY_ADDRESS,
  CampaignFactoryABI,
  wallet
);

const treasuryFactory = new ethers.Contract(
  TREASURY_FACTORY_ADDRESS,
  TreasuryFactoryABI,
  wallet
);

const globalParams = new ethers.Contract(
  GLOBAL_PARAMS_ADDRESS,
  GlobalParamsABI,
  wallet
);
```

## Creating Your First Campaign

### 1. Prepare Campaign Data

```javascript
// Campaign configuration
const campaignData = {
  creator: wallet.address,
  identifier: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-first-campaign')),
  goalAmount: ethers.utils.parseEther('10000'), // $10,000 goal
  launchTime: Math.floor(Date.now() / 1000) + 3600, // Launch in 1 hour
  deadline: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
  platforms: ['platform1', 'platform2'], // Selected platforms
  platformData: {
    'platform1': 'custom-data-1',
    'platform2': 'custom-data-2'
  }
};
```

### 2. Create the Campaign

```javascript
try {
  // Prepare campaign data for contract call
  const campaignData = {
    creator: wallet.address,
    identifierHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-first-campaign')),
    selectedPlatformHash: [ethers.utils.keccak256(ethers.utils.toUtf8Bytes('platform1'))],
    platformDataKey: [],
    platformDataValue: [],
    campaignData: {
      launchTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      deadline: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
      goalAmount: ethers.utils.parseEther('10000') // $10,000 goal
    }
  };

  // Create campaign using contract
  const tx = await campaignFactory.createCampaign(
    campaignData.creator,
    campaignData.identifierHash,
    campaignData.selectedPlatformHash,
    campaignData.platformDataKey,
    campaignData.platformDataValue,
    campaignData.campaignData
  );
  
  console.log('Campaign creation transaction sent!');
  console.log('Transaction Hash:', tx.hash);
  
  // Wait for confirmation
  const receipt = await tx.wait();
  console.log('Campaign created successfully!');
  
} catch (error) {
  console.error('Failed to create campaign:', error);
}
```

### 3. Monitor Campaign Status

```javascript
// Get campaign address from transaction events
const campaignCreatedEvent = receipt.events.find(e => e.event === 'CampaignInfoFactoryCampaignCreated');
const campaignAddress = campaignCreatedEvent.args.campaignAddress;

// Initialize campaign contract
const CampaignABI = []; // Import from contract artifacts
const campaign = new ethers.Contract(campaignAddress, CampaignABI, wallet);

// Get campaign information
const launchTime = await campaign.getLaunchTime();
const deadline = await campaign.getDeadline();
const goalAmount = await campaign.getGoalAmount();
const totalRaised = await campaign.getTotalRaisedAmount();
const isPaused = await campaign.paused();
const isCancelled = await campaign.cancelled();

console.log('Campaign Status:', {
  address: campaignAddress,
  launchTime: new Date(launchTime * 1000),
  deadline: new Date(deadline * 1000),
  goalAmount: ethers.utils.formatEther(goalAmount),
  totalRaised: ethers.utils.formatEther(totalRaised),
  isActive: Date.now() / 1000 >= launchTime && Date.now() / 1000 <= deadline,
  isPaused: isPaused,
  isCancelled: isCancelled
});
```

## Making Contributions

### 1. Contribute to Campaign

```javascript
// Get treasury contract for the campaign
const treasuryAddress = await campaign.getTreasuryAddress();
const TreasuryABI = []; // Import from contract artifacts
const treasury = new ethers.Contract(treasuryAddress, TreasuryABI, wallet);

try {
  // Make contribution (pledge without reward)
  const amount = ethers.utils.parseEther('100'); // $100 contribution
  
  const tx = await treasury.pledgeWithoutAReward(
    wallet.address, // backer address
    amount // pledge amount
  );
  
  console.log('Contribution transaction sent!');
  console.log('Transaction Hash:', tx.hash);
  
  // Wait for confirmation
  const receipt = await tx.wait();
  console.log('Contribution successful!');
  
} catch (error) {
  console.error('Failed to contribute:', error);
}
```

### 2. Check Contribution Status

```javascript
// Listen for contribution events
const contributionFilter = treasury.filters.Receipt(wallet.address);
const contributionEvents = await treasury.queryFilter(contributionFilter);

console.log('Your Contributions:', contributionEvents.map(event => ({
  tokenId: event.args.tokenId.toString(),
  amount: ethers.utils.formatEther(event.args.pledgeAmount),
  reward: event.args.reward,
  timestamp: new Date((await ethers.provider.getBlock(event.blockNumber)).timestamp * 1000)
})));
```

## Platform Integration

### 1. Create Platform Campaign

```javascript
// Platform-specific campaign creation
const platformHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-platform'));

// Create campaign with platform selection
const platformCampaignData = {
  creator: userAddress,
  identifierHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('platform-campaign')),
  selectedPlatformHash: [platformHash],
  platformDataKey: [ethers.utils.keccak256(ethers.utils.toUtf8Bytes('platformId'))],
  platformDataValue: [ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-platform'))],
  campaignData: {
    goalAmount: ethers.utils.parseEther('5000'),
    launchTime: Math.floor(Date.now() / 1000) + 3600,
    deadline: Math.floor(Date.now() / 1000) + 86400 * 14 // 14 days
  }
};

const tx = await campaignFactory.createCampaign(
  platformCampaignData.creator,
  platformCampaignData.identifierHash,
  platformCampaignData.selectedPlatformHash,
  platformCampaignData.platformDataKey,
  platformCampaignData.platformDataValue,
  platformCampaignData.campaignData
);
```

### 2. Handle Platform Events

```javascript
// Listen for platform-specific events
const platformCampaignFilter = campaignFactory.filters.CampaignInfoFactoryCampaignCreated();
const platformEvents = await campaignFactory.queryFilter(platformCampaignFilter);

platformEvents.forEach(event => {
  console.log('New platform campaign:', event.args.campaignAddress);
  console.log('Creator:', event.args.creator);
});

// Listen for contribution events on platform campaigns
const contributionFilter = treasury.filters.Receipt();
const contributionEvents = await treasury.queryFilter(contributionFilter);

contributionEvents.forEach(event => {
  console.log('Platform contribution:', {
    campaign: event.address,
    contributor: event.args.backer,
    amount: ethers.utils.formatEther(event.args.pledgeAmount)
  });
});
```

## Advanced Features

### 1. Reward Management

```javascript
// Add rewards to campaign (using AllOrNothing treasury)
const rewards = [
  {
    name: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('early-bird')),
    value: ethers.utils.parseEther('50'),
    isRewardTier: true,
    items: [
      {
        id: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('t-shirt')),
        value: ethers.utils.parseEther('20'),
        quantity: 1
      }
    ]
  },
  {
    name: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('supporter')),
    value: ethers.utils.parseEther('100'),
    isRewardTier: true,
    items: [
      {
        id: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('t-shirt')),
        value: ethers.utils.parseEther('20'),
        quantity: 1
      },
      {
        id: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('sticker-pack')),
        value: ethers.utils.parseEther('5'),
        quantity: 3
      }
    ]
  }
];

// Add rewards using treasury contract
const rewardNames = rewards.map(r => r.name);
const rewardValues = rewards.map(r => r);
await treasury.addRewards(rewardNames, rewardValues);
```

### 2. Campaign Management

```javascript
// Update campaign parameters (before launch)
await campaign.updateGoalAmount(ethers.utils.parseEther('15000'));

// Pause campaign (admin only)
await campaign._pauseCampaign(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Emergency pause')));

// Unpause campaign
await campaign._unpauseCampaign(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Issue resolved')));
```

### 3. Fund Distribution

```javascript
// Check if campaign is successful
const totalRaised = await campaign.getTotalRaisedAmount();
const goalAmount = await campaign.getGoalAmount();
const isSuccessful = totalRaised >= goalAmount;

if (isSuccessful) {
  // Withdraw funds (campaign owner only)
  await treasury.withdraw();
  console.log('Funds withdrawn successfully!');
} else {
  // Claim refunds for failed campaign
  const contributionEvents = await treasury.queryFilter(treasury.filters.Receipt(wallet.address));
  
  for (const event of contributionEvents) {
    const tokenId = event.args.tokenId;
    try {
      await treasury.claimRefund(tokenId);
      console.log(`Refund claimed for token ${tokenId}`);
    } catch (error) {
      console.log(`Refund not available for token ${tokenId}:`, error.message);
    }
  }
}
```

## Error Handling

### Common Errors

```javascript
try {
  await campaignFactory.createCampaign(
    campaignData.creator,
    campaignData.identifierHash,
    campaignData.selectedPlatformHash,
    campaignData.platformDataKey,
    campaignData.platformDataValue,
    campaignData.campaignData
  );
} catch (error) {
  if (error.message.includes('CampaignInfoFactoryInvalidInput')) {
    console.error('Invalid input provided');
  } else if (error.message.includes('CampaignInfoFactoryPlatformNotListed')) {
    console.error('Selected platform is not available');
  } else if (error.message.includes('CampaignInfoFactoryCampaignWithSameIdentifierExists')) {
    console.error('Campaign with this identifier already exists');
  } else if (error.message.includes('INSUFFICIENT_FUNDS')) {
    console.error('Insufficient balance for gas fees');
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
      return await campaignFactory.createCampaign(
        campaignData.creator,
        campaignData.identifierHash,
        campaignData.selectedPlatformHash,
        campaignData.platformDataKey,
        campaignData.platformDataValue,
        campaignData.campaignData
      );
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Testing

### 1. Unit Tests

```javascript
import { expect } from 'chai';
import { ethers } from 'ethers';

describe('Oak Network Integration', () => {
  let campaignFactory;
  let wallet;
  
  beforeEach(async () => {
    // Setup test environment
    campaignFactory = await deployCampaignFactory();
    wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);
  });
  
  it('should create a campaign', async () => {
    const campaignData = {
      creator: wallet.address,
      identifierHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('test-campaign')),
      selectedPlatformHash: [ethers.utils.keccak256(ethers.utils.toUtf8Bytes('test-platform'))],
      platformDataKey: [],
      platformDataValue: [],
      campaignData: {
        goalAmount: ethers.utils.parseEther('1000'),
        launchTime: Math.floor(Date.now() / 1000) + 3600,
        deadline: Math.floor(Date.now() / 1000) + 86400
      }
    };
    
    const tx = await campaignFactory.createCampaign(
      campaignData.creator,
      campaignData.identifierHash,
      campaignData.selectedPlatformHash,
      campaignData.platformDataKey,
      campaignData.platformDataValue,
      campaignData.campaignData
    );
    
    expect(tx.hash).to.be.a('string');
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
});
```

### 2. Integration Tests

```javascript
describe('Campaign Lifecycle', () => {
  it('should complete full campaign lifecycle', async () => {
    // Create campaign
    const tx = await campaignFactory.createCampaign(
      campaignData.creator,
      campaignData.identifierHash,
      campaignData.selectedPlatformHash,
      campaignData.platformDataKey,
      campaignData.platformDataValue,
      campaignData.campaignData
    );
    
    const receipt = await tx.wait();
    const campaignAddress = receipt.events.find(e => e.event === 'CampaignInfoFactoryCampaignCreated').args.campaignAddress;
    
    // Wait for launch
    await ethers.provider.send('evm_increaseTime', [3600]); // Fast forward 1 hour
    await ethers.provider.send('evm_mine');
    
    // Make contributions
    const treasury = await getTreasuryContract(campaignAddress);
    await treasury.pledgeWithoutAReward(wallet.address, ethers.utils.parseEther('100'));
    
    // Check status
    const totalRaised = await treasury.getRaisedAmount();
    expect(totalRaised).to.equal(ethers.utils.parseEther('100'));
  });
});
```

## Next Steps

- [Create Campaign Guide](/docs/guides/create-campaign) - Detailed campaign creation
- [Platform Integration](/docs/guides/platform-integration) - Building platform integrations
- [Smart Contract Reference](/docs/contracts/overview) - Complete contract documentation
- [Security Overview](/docs/security/overview) - Security best practices
