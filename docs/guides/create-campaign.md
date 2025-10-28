# Create Your First Campaign

This guide will walk you through creating your first campaign on Oak Network using direct smart contract integration via frontend.

## Prerequisites

Before creating a campaign, ensure you have:

- **Wallet Setup**: MetaMask or similar wallet connected to Celo
- **Test Tokens**: CELO testnet tokens for gas fees
- **Campaign Data**: Goal amount, timeline, and description ready
- **Platform Selection**: Choose which platforms to integrate with

## Step 1: Environment Setup

### Install Dependencies

```bash
npm install ethers @openzeppelin/contracts
```

### Contract Addresses

```javascript
// Celo Alfajores Testnet Contract Addresses
const CONTRACT_ADDRESSES = {
  CAMPAIGN_INFO_FACTORY: '0x...', // Replace with actual factory address
  TREASURY_FACTORY: '0x...', // Replace with actual treasury factory address
  GLOBAL_PARAMS: '0x...', // Replace with actual global params address
  ITEM_REGISTRY: '0x...', // Replace with actual item registry address
};

// USDC Token Address on Celo Alfajores
const USDC_ADDRESS = '0x874069Fa1Eb16D44d622F2e0Da25bA13524Fe01'; // USDC on Alfajores
```

### Initialize Provider and Signer

```javascript
import { ethers } from 'ethers';

// Connect to Celo testnet
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Get user address
const userAddress = await signer.getAddress();
console.log('Connected to:', userAddress);
```

## Step 2: Contract ABI Setup

### Campaign Info Factory ABI

```javascript
const CAMPAIGN_INFO_FACTORY_ABI = [
  "function createCampaign(address creator, bytes32 identifier, address[] platforms, bytes[] platformData, tuple(uint256 goalAmount, uint256 launchTime, uint256 deadline) campaignData) external returns (address)",
  "function getCampaign(address creator, bytes32 identifier) external view returns (address)",
  "function getAvailablePlatforms() external view returns (address[])",
  "event CampaignCreated(address indexed creator, bytes32 indexed identifier, address campaign, address[] platforms)"
];

const CAMPAIGN_INFO_ABI = [
  "function getInfo() external view returns (tuple(address creator, uint256 goalAmount, uint256 totalRaised, uint256 launchTime, uint256 deadline, bool isActive, bool isPaused, bool isCancelled))",
  "function updateLaunchTime(uint256 newLaunchTime) external",
  "function updateDeadline(uint256 newDeadline) external",
  "function updateGoalAmount(uint256 newGoalAmount) external",
  "function pause(string memory reason) external",
  "function unpause(string memory reason) external",
  "function cancel(string memory reason) external",
  "function addPlatformData(bytes32 platformHash, bytes memory data) external",
  "function isSuccessful() external view returns (bool)",
  "function isFailed() external view returns (bool)",
  "event CampaignUpdated(address indexed campaign, string updateType)",
  "event CampaignPaused(address indexed campaign, string reason)",
  "event CampaignCancelled(address indexed campaign, string reason)"
];
```

### Treasury Factory ABI

```javascript
const TREASURY_FACTORY_ABI = [
  "function registerTreasury(address treasury, string memory name, string memory description) external",
  "function approveTreasury(address treasury) external",
  "function deployTreasury(address campaign, address treasuryTemplate) external returns (address)",
  "function getRegisteredTreasuries() external view returns (address[])",
  "function getApprovedTreasuries() external view returns (address[])",
  "event TreasuryRegistered(address indexed treasury, string name)",
  "event TreasuryApproved(address indexed treasury)",
  "event TreasuryDeployed(address indexed campaign, address indexed treasury)"
];
```

## Step 3: Prepare Campaign Data

### Basic Campaign Information

```javascript
// Campaign configuration
const campaignData = {
  creator: userAddress,
  identifier: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('my-first-campaign')),
  goalAmount: ethers.utils.parseUnits('10000', 6), // $10,000 USDC (6 decimals)
  launchTime: Math.floor(Date.now() / 1000) + 3600, // Launch in 1 hour
  deadline: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
  platforms: [], // Will be populated with actual platform addresses
  platformData: [] // Will be populated with platform-specific data
};

// Generate unique campaign identifier
function generateCampaignIdentifier(title, creator) {
  const uniqueString = `${title}-${creator}-${Date.now()}`;
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(uniqueString));
}

// Example usage
const campaignIdentifier = generateCampaignIdentifier('My First Campaign', userAddress);
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
  
  return true;
}

// Validate before creating
validateCampaignData(campaignData);
```

## Step 4: Create the Campaign

### Initialize Contracts

```javascript
// Initialize contract instances
const campaignInfoFactory = new ethers.Contract(
  CONTRACT_ADDRESSES.CAMPAIGN_INFO_FACTORY,
  CAMPAIGN_INFO_FACTORY_ABI,
  signer
);

const treasuryFactory = new ethers.Contract(
  CONTRACT_ADDRESSES.TREASURY_FACTORY,
  TREASURY_FACTORY_ABI,
  signer
);
```

### Basic Campaign Creation

```javascript
async function createCampaign(campaignData) {
  try {
    // Validate campaign data
    validateCampaignData(campaignData);
    
    // Get available platforms
    const availablePlatforms = await campaignInfoFactory.getAvailablePlatforms();
    console.log('Available platforms:', availablePlatforms);
    
    // For this example, we'll use the first available platform
    const selectedPlatforms = availablePlatforms.length > 0 ? [availablePlatforms[0]] : [];
    const platformData = selectedPlatforms.map(() => ethers.utils.toUtf8Bytes(''));
    
    // Prepare campaign data tuple
    const campaignDataTuple = [
      campaignData.goalAmount,
      campaignData.launchTime,
      campaignData.deadline
    ];
    
    // Create campaign
    const tx = await campaignInfoFactory.createCampaign(
      campaignData.creator,
      campaignData.identifier,
      selectedPlatforms,
      platformData,
      campaignDataTuple
    );
    
    console.log('Transaction submitted:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
    
    // Get campaign address from event
    const campaignCreatedEvent = receipt.events.find(
      event => event.event === 'CampaignCreated'
    );
    
    if (campaignCreatedEvent) {
      const campaignAddress = campaignCreatedEvent.args.campaign;
      console.log('Campaign created successfully!');
      console.log('Campaign Address:', campaignAddress);
      
      return {
        address: campaignAddress,
        txHash: receipt.transactionHash,
        receipt: receipt
      };
    } else {
      throw new Error('Campaign creation event not found');
    }
    
  } catch (error) {
    console.error('Failed to create campaign:', error);
    throw error;
  }
}

// Create campaign
const result = await createCampaign(campaignData);
```

### Advanced Campaign Creation with Treasury

```javascript
async function createCampaignWithTreasury(campaignData, treasuryType = 'all-or-nothing') {
  try {
    // First create the campaign
    const campaignResult = await createCampaign(campaignData);
    const campaignAddress = campaignResult.address;
    
    // Get approved treasuries
    const approvedTreasuries = await treasuryFactory.getApprovedTreasuries();
    console.log('Approved treasuries:', approvedTreasuries);
    
    if (approvedTreasuries.length === 0) {
      throw new Error('No approved treasuries available');
    }
    
    // Select treasury based on type
    let selectedTreasury;
    if (treasuryType === 'all-or-nothing') {
      // Find AllOrNothing treasury
      selectedTreasury = approvedTreasuries.find(async (treasury) => {
        // You would check the treasury type here
        // This is a simplified example
        return true; // For now, use the first available
      });
    }
    
    if (!selectedTreasury) {
      selectedTreasury = approvedTreasuries[0];
    }
    
    // Deploy treasury for the campaign
    const treasuryTx = await treasuryFactory.deployTreasury(
      campaignAddress,
      selectedTreasury
    );
    
    const treasuryReceipt = await treasuryTx.wait();
    console.log('Treasury deployed:', treasuryReceipt.transactionHash);
    
    return {
      campaign: campaignResult,
      treasury: {
        address: treasuryReceipt.events.find(e => e.event === 'TreasuryDeployed')?.args.treasury,
        txHash: treasuryReceipt.transactionHash
      }
    };
    
  } catch (error) {
    console.error('Failed to create campaign with treasury:', error);
    throw error;
  }
}
```

## Step 5: Configure Campaign Settings

### Initialize Campaign Contract

```javascript
async function getCampaignContract(campaignAddress) {
  return new ethers.Contract(
    campaignAddress,
    CAMPAIGN_INFO_ABI,
    signer
  );
}
```

### Update Campaign Parameters

```javascript
// Update campaign parameters (before launch)
async function updateCampaignSettings(campaignAddress, updates) {
  const campaign = await getCampaignContract(campaignAddress);
  
  try {
    // Update launch time
    if (updates.launchTime) {
      const tx = await campaign.updateLaunchTime(updates.launchTime);
      await tx.wait();
      console.log('Launch time updated');
    }
    
    // Update deadline
    if (updates.deadline) {
      const tx = await campaign.updateDeadline(updates.deadline);
      await tx.wait();
      console.log('Deadline updated');
    }
    
    // Update goal amount
    if (updates.goalAmount) {
      const tx = await campaign.updateGoalAmount(updates.goalAmount);
      await tx.wait();
      console.log('Goal amount updated');
    }
    
  } catch (error) {
    console.error('Failed to update campaign settings:', error);
    throw error;
  }
}
```

### Add Platform Data

```javascript
// Add platform-specific data
async function addPlatformData(campaignAddress, platformHash, data) {
  const campaign = await getCampaignContract(campaignAddress);
  
  try {
    const tx = await campaign.addPlatformData(
      platformHash,
      ethers.utils.toUtf8Bytes(data)
    );
    
    await tx.wait();
    console.log('Platform data added');
    
  } catch (error) {
    console.error('Failed to add platform data:', error);
    throw error;
  }
}
```

## Step 6: Monitor Campaign Status

### Check Campaign Information

```javascript
// Get campaign information
async function getCampaignInfo(campaignAddress) {
  const campaign = await getCampaignContract(campaignAddress);
  
  try {
    const info = await campaign.getInfo();
    
    const campaignInfo = {
      creator: info.creator,
      goalAmount: ethers.utils.formatUnits(info.goalAmount, 6), // USDC has 6 decimals
      totalRaised: ethers.utils.formatUnits(info.totalRaised, 6),
      launchTime: new Date(info.launchTime * 1000),
      deadline: new Date(info.deadline * 1000),
      isActive: info.isActive,
      isPaused: info.isPaused,
      isCancelled: info.isCancelled,
      successRate: (info.totalRaised / info.goalAmount) * 100
    };
    
    console.log('Campaign Information:', campaignInfo);
    return campaignInfo;
    
  } catch (error) {
    console.error('Failed to get campaign info:', error);
    throw error;
  }
}
```

### Monitor Campaign Events

```javascript
// Set up event monitoring
function setupCampaignMonitoring(campaignAddress) {
  const campaign = new ethers.Contract(
    campaignAddress,
    CAMPAIGN_INFO_ABI,
    provider
  );
  
  // Monitor campaign updates
  campaign.on('CampaignUpdated', (campaign, updateType, event) => {
    console.log('Campaign updated:', {
      campaign,
      updateType,
      blockNumber: event.blockNumber
    });
  });
  
  // Monitor campaign state changes
  campaign.on('CampaignPaused', (campaign, reason, event) => {
    console.log('Campaign paused:', {
      campaign,
      reason,
      blockNumber: event.blockNumber
    });
  });
  
  campaign.on('CampaignCancelled', (campaign, reason, event) => {
    console.log('Campaign cancelled:', {
      campaign,
      reason,
      blockNumber: event.blockNumber
    });
  });
  
  return campaign;
}
```

## Step 7: Launch and Manage Campaign

### Launch Campaign

```javascript
// Launch campaign when ready
async function launchCampaign(campaignAddress) {
  const campaign = await getCampaignContract(campaignAddress);
  
  try {
    // Check if campaign is ready to launch
    const now = Math.floor(Date.now() / 1000);
    const info = await campaign.getInfo();
    
    if (now < info.launchTime) {
      console.log(`Campaign will launch in ${info.launchTime - now} seconds`);
      return;
    }
    
    // Campaign is now active
    console.log('Campaign is now active and accepting contributions!');
    
  } catch (error) {
    console.error('Failed to check campaign launch status:', error);
    throw error;
  }
}
```

### Manage Campaign During Active Phase

```javascript
// Campaign management functions
class CampaignManager {
  constructor(campaignAddress) {
    this.campaignAddress = campaignAddress;
  }
  
  async getCampaignContract() {
    return await getCampaignContract(this.campaignAddress);
  }
  
  // Pause campaign
  async pauseCampaign(reason) {
    const campaign = await this.getCampaignContract();
    const tx = await campaign.pause(reason);
    await tx.wait();
    console.log('Campaign paused:', reason);
  }
  
  // Unpause campaign
  async unpauseCampaign(reason) {
    const campaign = await this.getCampaignContract();
    const tx = await campaign.unpause(reason);
    await tx.wait();
    console.log('Campaign unpaused:', reason);
  }
  
  // Cancel campaign
  async cancelCampaign(reason) {
    const campaign = await this.getCampaignContract();
    const tx = await campaign.cancel(reason);
    await tx.wait();
    console.log('Campaign cancelled:', reason);
  }
  
  // Get campaign statistics
  async getStatistics() {
    const info = await getCampaignInfo(this.campaignAddress);
    
    return {
      totalRaised: info.totalRaised,
      goalAmount: info.goalAmount,
      successRate: info.successRate,
      timeRemaining: Math.max(0, info.deadline.getTime() - Date.now()),
      isActive: info.isActive,
      isPaused: info.isPaused,
      isCancelled: info.isCancelled
    };
  }
}

// Usage
const campaignManager = new CampaignManager(campaignAddress);
const stats = await campaignManager.getStatistics();
console.log('Campaign Statistics:', stats);
```

## Step 8: Handle Campaign Completion

### Check Campaign Status

```javascript
// Check if campaign is successful
async function checkCampaignStatus(campaignAddress) {
  const campaign = await getCampaignContract(campaignAddress);
  
  try {
    const isSuccessful = await campaign.isSuccessful();
    const isFailed = await campaign.isFailed();
    
    if (isSuccessful) {
      console.log('Campaign was successful!');
      return 'successful';
    } else if (isFailed) {
      console.log('Campaign failed');
      return 'failed';
    } else {
      console.log('Campaign is still active');
      return 'active';
    }
    
  } catch (error) {
    console.error('Failed to check campaign status:', error);
    throw error;
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

### Gas Optimization

1. **Batch Operations**: Combine multiple operations when possible
2. **Gas Estimation**: Always estimate gas before transactions
3. **Error Handling**: Implement proper error handling for failed transactions
4. **Retry Logic**: Implement retry logic for network issues

## Troubleshooting

### Common Issues

```javascript
// Common error handling
async function handleTransactionError(error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Insufficient balance for gas fees');
  } else if (error.message.includes('execution reverted')) {
    console.error('Transaction reverted:', error.message);
  } else if (error.code === 'NETWORK_ERROR') {
    console.error('Network error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}

// Example usage
try {
  await createCampaign(campaignData);
} catch (error) {
  await handleTransactionError(error);
}
```

### Debugging

```javascript
// Debug campaign creation
async function debugCampaignCreation(campaignData) {
  console.log('Campaign Data:', campaignData);
  
  try {
    // Check wallet balance
    const balance = await signer.getBalance();
    console.log('Wallet Balance:', ethers.utils.formatEther(balance));
    
    // Check platform availability
    const platforms = await campaignInfoFactory.getAvailablePlatforms();
    console.log('Available Platforms:', platforms);
    
    // Validate campaign data
    validateCampaignData(campaignData);
    console.log('Campaign data is valid');
    
  } catch (error) {
    console.error('Debug failed:', error.message);
  }
}
```

## Next Steps

- [Platform Integration](/docs/guides/platform-integration) - Integrate with platforms
- [Advanced Features](/docs/guides/advanced-features) - Explore advanced capabilities
- [Treasury Models](/docs/guides/treasury-models) - Choose funding models
- [Smart Contract Reference](/docs/contracts/overview) - Complete contract documentation