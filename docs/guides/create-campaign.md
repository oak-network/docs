# Create Your First Campaign

This guide will walk you through creating your first campaign on Oak Network, from setup to launch.

## Prerequisites

Before creating a campaign, ensure you have:

- **Wallet Setup**: MetaMask or similar wallet connected to Celo
- **Test Tokens**: CELO testnet tokens for gas fees
- **Campaign Data**: Goal amount, timeline, and description ready
- **Platform Selection**: Choose which platforms to integrate with

## Step 1: Environment Setup

### Install Dependencies

```bash
npm install @oaknetwork/sdk ethers
```

### Initialize SDK

```javascript
import { OakNetwork } from '@oaknetwork/sdk';
import { ethers } from 'ethers';

// Connect to Celo testnet
const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize Oak Network
const oakNetwork = new OakNetwork({
  provider: provider,
  signer: wallet,
  network: 'alfajores'
});
```

## Step 2: Prepare Campaign Data

### Basic Campaign Information

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

### Campaign Validation

```javascript
// Validate campaign data
function validateCampaignData(campaignData) {
  const now = Math.floor(Date.now() / 1000);
  
  // Check launch time
  if (campaignData.launchTime <= now) {
    throw new Error('Launch time must be in the future');
  }
  
  // Check deadline
  if (campaignData.deadline <= campaignData.launchTime) {
    throw new Error('Deadline must be after launch time');
  }
  
  // Check goal amount
  if (campaignData.goalAmount <= 0) {
    throw new Error('Goal amount must be positive');
  }
  
  // Check platforms
  if (!campaignData.platforms || campaignData.platforms.length === 0) {
    throw new Error('At least one platform must be selected');
  }
  
  return true;
}

// Validate before creating
validateCampaignData(campaignData);
```

## Step 3: Create the Campaign

### Basic Campaign Creation

```javascript
try {
  // Create campaign
  const campaign = await oakNetwork.createCampaign(campaignData);
  
  console.log('Campaign created successfully!');
  console.log('Campaign Address:', campaign.address);
  console.log('Transaction Hash:', campaign.txHash);
  
  // Wait for confirmation
  await campaign.wait();
  
} catch (error) {
  console.error('Failed to create campaign:', error);
}
```

### Advanced Campaign Creation

```javascript
// Advanced campaign creation with error handling
async function createCampaignAdvanced(campaignData) {
  try {
    // Validate campaign data
    validateCampaignData(campaignData);
    
    // Check platform availability
    const availablePlatforms = await oakNetwork.getAvailablePlatforms();
    const validPlatforms = campaignData.platforms.filter(platform => 
      availablePlatforms.includes(platform)
    );
    
    if (validPlatforms.length === 0) {
      throw new Error('No valid platforms selected');
    }
    
    // Create campaign with valid platforms
    const campaignDataWithValidPlatforms = {
      ...campaignData,
      platforms: validPlatforms
    };
    
    const campaign = await oakNetwork.createCampaign(campaignDataWithValidPlatforms);
    
    // Store campaign data locally
    await storeCampaignData(campaign.address, campaignData);
    
    return campaign;
    
  } catch (error) {
    console.error('Campaign creation failed:', error);
    throw error;
  }
}
```

## Step 4: Configure Campaign Settings

### Update Campaign Parameters

```javascript
// Update campaign parameters (before launch)
async function updateCampaignSettings(campaignAddress, updates) {
  const campaign = oakNetwork.getCampaign(campaignAddress);
  
  // Update launch time
  if (updates.launchTime) {
    await campaign.updateLaunchTime(updates.launchTime);
  }
  
  // Update deadline
  if (updates.deadline) {
    await campaign.updateDeadline(updates.deadline);
  }
  
  // Update goal amount
  if (updates.goalAmount) {
    await campaign.updateGoalAmount(updates.goalAmount);
  }
  
  // Update platform selection
  if (updates.platforms) {
    for (const platform of updates.platforms) {
      await campaign.updateSelectedPlatform(platform.hash, platform.selected);
    }
  }
}
```

### Add Platform Data

```javascript
// Add platform-specific data
async function addPlatformData(campaignAddress, platformData) {
  const campaign = oakNetwork.getCampaign(campaignAddress);
  
  // Add platform data
  for (const [platformHash, data] of Object.entries(platformData)) {
    await campaign.addPlatformData(platformHash, data);
  }
}
```

## Step 5: Set Up Rewards (Optional)

### Define Reward Tiers

```javascript
// Define reward tiers
const rewards = [
  {
    name: 'early-bird',
    value: ethers.utils.parseEther('50'),
    isRewardTier: true,
    items: [
      {
        id: 't-shirt',
        value: ethers.utils.parseEther('20'),
        quantity: 1
      }
    ]
  },
  {
    name: 'supporter',
    value: ethers.utils.parseEther('100'),
    isRewardTier: true,
    items: [
      {
        id: 't-shirt',
        value: ethers.utils.parseEther('20'),
        quantity: 1
      },
      {
        id: 'sticker-pack',
        value: ethers.utils.parseEther('5'),
        quantity: 3
      }
    ]
  },
  {
    name: 'vip',
    value: ethers.utils.parseEther('500'),
    isRewardTier: true,
    items: [
      {
        id: 't-shirt',
        value: ethers.utils.parseEther('20'),
        quantity: 1
      },
      {
        id: 'sticker-pack',
        value: ethers.utils.parseEther('5'),
        quantity: 5
      },
      {
        id: 'exclusive-access',
        value: ethers.utils.parseEther('100'),
        quantity: 1
      }
    ]
  }
];

// Add rewards to campaign
await oakNetwork.addRewards(campaign.address, rewards);
```

### Manage Items

```javascript
// Add items to the registry
const items = [
  {
    id: 't-shirt',
    name: 'Oak Network T-Shirt',
    description: 'High-quality cotton t-shirt with Oak Network logo',
    value: ethers.utils.parseEther('20'),
    quantity: 100
  },
  {
    id: 'sticker-pack',
    name: 'Sticker Pack',
    description: 'Set of 5 Oak Network stickers',
    value: ethers.utils.parseEther('5'),
    quantity: 500
  }
];

// Add items
for (const item of items) {
  await oakNetwork.addItem(item);
}
```

## Step 6: Monitor Campaign Status

### Check Campaign Information

```javascript
// Get campaign information
async function getCampaignInfo(campaignAddress) {
  const campaign = oakNetwork.getCampaign(campaignAddress);
  
  const info = await campaign.getInfo();
  
  console.log('Campaign Information:', {
    creator: info.creator,
    goalAmount: ethers.utils.formatEther(info.goalAmount),
    totalRaised: ethers.utils.formatEther(info.totalRaised),
    launchTime: new Date(info.launchTime * 1000),
    deadline: new Date(info.deadline * 1000),
    isActive: info.isActive,
    isPaused: info.isPaused,
    isCancelled: info.isCancelled,
    successRate: (info.totalRaised / info.goalAmount) * 100
  });
  
  return info;
}
```

### Monitor Campaign Events

```javascript
// Set up event monitoring
function setupCampaignMonitoring(campaignAddress) {
  const campaign = oakNetwork.getCampaign(campaignAddress);
  
  // Monitor contributions
  campaign.on('Contribution', (event) => {
    console.log('New contribution:', {
      contributor: event.contributor,
      amount: ethers.utils.formatEther(event.amount),
      reward: event.reward
    });
  });
  
  // Monitor campaign updates
  campaign.on('CampaignUpdated', (event) => {
    console.log('Campaign updated:', event);
  });
  
  // Monitor campaign state changes
  campaign.on('CampaignPaused', (event) => {
    console.log('Campaign paused:', event.reason);
  });
  
  campaign.on('CampaignCancelled', (event) => {
    console.log('Campaign cancelled:', event.reason);
  });
}
```

## Step 7: Launch and Manage Campaign

### Launch Campaign

```javascript
// Launch campaign when ready
async function launchCampaign(campaignAddress) {
  const campaign = oakNetwork.getCampaign(campaignAddress);
  
  // Check if campaign is ready to launch
  const now = Math.floor(Date.now() / 1000);
  const launchTime = await campaign.getLaunchTime();
  
  if (now < launchTime) {
    console.log(`Campaign will launch in ${launchTime - now} seconds`);
    return;
  }
  
  // Campaign is now active
  console.log('Campaign is now active and accepting contributions!');
}
```

### Manage Campaign During Active Phase

```javascript
// Campaign management functions
class CampaignManager {
  constructor(campaignAddress) {
    this.campaign = oakNetwork.getCampaign(campaignAddress);
  }
  
  // Pause campaign
  async pauseCampaign(reason) {
    await this.campaign.pause(reason);
    console.log('Campaign paused:', reason);
  }
  
  // Unpause campaign
  async unpauseCampaign(reason) {
    await this.campaign.unpause(reason);
    console.log('Campaign unpaused:', reason);
  }
  
  // Cancel campaign
  async cancelCampaign(reason) {
    await this.campaign.cancel(reason);
    console.log('Campaign cancelled:', reason);
  }
  
  // Get campaign statistics
  async getStatistics() {
    const info = await this.campaign.getInfo();
    const contributions = await this.campaign.getContributions();
    
    return {
      totalContributions: contributions.length,
      totalRaised: ethers.utils.formatEther(info.totalRaised),
      goalAmount: ethers.utils.formatEther(info.goalAmount),
      successRate: (info.totalRaised / info.goalAmount) * 100,
      timeRemaining: info.deadline - Math.floor(Date.now() / 1000)
    };
  }
}
```

## Step 8: Handle Campaign Completion

### Successful Campaign

```javascript
// Handle successful campaign
async function handleSuccessfulCampaign(campaignAddress) {
  const campaign = oakNetwork.getCampaign(campaignAddress);
  
  // Check if campaign is successful
  const isSuccessful = await campaign.isSuccessful();
  
  if (isSuccessful) {
    // Withdraw funds
    await campaign.withdraw();
    console.log('Funds withdrawn successfully!');
    
    // Distribute rewards
    await distributeRewards(campaignAddress);
    
    // Update campaign status
    await updateCampaignStatus(campaignAddress, 'successful');
  }
}
```

### Failed Campaign

```javascript
// Handle failed campaign
async function handleFailedCampaign(campaignAddress) {
  const campaign = oakNetwork.getCampaign(campaignAddress);
  
  // Check if campaign failed
  const isFailed = await campaign.isFailed();
  
  if (isFailed) {
    // Enable refunds
    await campaign.enableRefunds();
    console.log('Refunds enabled for failed campaign');
    
    // Notify contributors
    await notifyContributors(campaignAddress);
    
    // Update campaign status
    await updateCampaignStatus(campaignAddress, 'failed');
  }
}
```

## Best Practices

### Campaign Design

1. **Realistic Goals**: Set achievable funding targets
2. **Clear Timeline**: Provide sufficient time for funding
3. **Compelling Description**: Write clear, engaging campaign descriptions
4. **Appropriate Rewards**: Offer valuable, achievable rewards

### Security

1. **Secure Keys**: Use hardware wallets for campaign management
2. **Regular Monitoring**: Monitor campaign status regularly
3. **Backup Plans**: Have contingency plans for emergencies
4. **User Education**: Educate users about the platform

### Marketing

1. **Social Media**: Promote campaigns on social media
2. **Community Engagement**: Engage with the community
3. **Regular Updates**: Provide regular campaign updates
4. **Transparency**: Be transparent about progress and challenges

## Troubleshooting

### Common Issues

```javascript
// Common error handling
try {
  await oakNetwork.createCampaign(campaignData);
} catch (error) {
  if (error.message.includes('INVALID_LAUNCH_TIME')) {
    console.error('Launch time must be in the future');
  } else if (error.message.includes('INVALID_DEADLINE')) {
    console.error('Deadline must be after launch time');
  } else if (error.message.includes('PLATFORM_NOT_LISTED')) {
    console.error('Selected platform is not available');
  } else if (error.message.includes('INSUFFICIENT_FUNDS')) {
    console.error('Insufficient balance for gas fees');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

### Debugging

```javascript
// Debug campaign creation
async function debugCampaignCreation(campaignData) {
  console.log('Campaign Data:', campaignData);
  
  // Check wallet balance
  const balance = await wallet.getBalance();
  console.log('Wallet Balance:', ethers.utils.formatEther(balance));
  
  // Check platform availability
  const platforms = await oakNetwork.getAvailablePlatforms();
  console.log('Available Platforms:', platforms);
  
  // Validate campaign data
  try {
    validateCampaignData(campaignData);
    console.log('Campaign data is valid');
  } catch (error) {
    console.error('Campaign data validation failed:', error.message);
  }
}
```

## Next Steps

- [Platform Integration](/docs/guides/platform-integration) - Integrate with platforms
- [Advanced Features](/docs/guides/advanced-features) - Explore advanced capabilities
- [Treasury Models](/docs/guides/treasury-models) - Choose funding models
- [API Reference](/docs/api/reference) - Complete API documentation

