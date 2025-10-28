# Platform Integration

Platforms are applications or services that integrate with Oak Network to provide crowdfunding functionality. This section covers how platforms work, their roles, and how to integrate them.

## What is a Platform?

A **Platform** in Oak Network is any application or service that:

- Integrates with Oak Network smart contracts
- Provides crowdfunding functionality to users
- Manages campaigns on behalf of creators
- Handles user interactions and UI/UX

## Platform Roles

### Platform Admin

Each platform has a designated **Platform Admin** who can:

- **Manage Platform Settings**: Configure platform-specific parameters
- **Set Platform Fees**: Define the fee percentage for their platform
- **Pause Platform Campaigns**: Temporarily halt all platform campaigns
- **Cancel Platform Campaigns**: Permanently cancel platform campaigns
- **Access Platform Data**: View platform-specific campaign information

### Platform Responsibilities

Platforms are responsible for:

1. **User Interface**: Providing intuitive interfaces for campaign creation and management
2. **Campaign Validation**: Ensuring campaigns meet platform-specific requirements
3. **User Support**: Handling user inquiries and technical support
4. **Fee Management**: Collecting and managing platform fees
5. **Integration**: Seamlessly integrating Oak Network functionality

## Platform Registration

### Prerequisites

Before registering a platform, ensure you have:

- **Valid Admin Address**: A secure address for platform administration
- **Platform Information**: Name, description, and contact details
- **Fee Structure**: Proposed platform fee percentage
- **Treasury Address**: Address to receive platform fees

### Registration Process

```solidity
// Platform registration data
struct PlatformInfo {
    address adminAddress;          // Platform admin
    uint256 feePercent;           // Platform fee percentage
    address treasuryAddress;       // Platform treasury
    bool isListed;                // Whether platform is listed
}

// Register platform
function addPlatform(
    bytes32 platformHash,
    PlatformInfo calldata platformInfo
) external onlyProtocolAdmin {
    require(platformInfo.adminAddress != address(0), "Invalid admin");
    require(platformInfo.feePercent <= MAX_PLATFORM_FEE, "Fee too high");
    require(platformInfo.treasuryAddress != address(0), "Invalid treasury");
    
    s_platforms[platformHash] = platformInfo;
    s_platformHashes.push(platformHash);
    
    emit PlatformAdded(platformHash, platformInfo);
}
```

### Platform Hash Generation

Platform hashes are generated using a deterministic method:

```javascript
// Generate platform hash
function generatePlatformHash(platformName, adminAddress) {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'address'],
      [platformName, adminAddress]
    )
  );
}

// Example
const platformHash = generatePlatformHash('MyPlatform', adminAddress);
```

## Platform Integration Patterns

### Direct Integration

Platforms can directly interact with Oak Network contracts:

```javascript
// Direct integration example
class OakPlatform {
  constructor(contracts, adminWallet) {
    this.campaignFactory = contracts.campaignFactory;
    this.treasuryFactory = contracts.treasuryFactory;
    this.adminWallet = adminWallet;
  }
  
  async createCampaign(campaignData) {
    // Validate campaign data
    await this.validateCampaign(campaignData);
    
    // Create campaign
    const tx = await this.campaignFactory.createCampaign(
      campaignData.creator,
      campaignData.identifier,
      [this.platformHash], // Only this platform
      campaignData.platformDataKeys,
      campaignData.platformDataValues,
      campaignData.campaignData
    );
    
    return tx;
  }
  
  async validateCampaign(campaignData) {
    // Platform-specific validation
    if (campaignData.goalAmount < this.minGoalAmount) {
      throw new Error('Goal amount too low');
    }
    
    if (campaignData.deadline - campaignData.launchTime < this.minDuration) {
      throw new Error('Campaign duration too short');
    }
  }
}
```

### SDK Integration

Use Oak Network SDKs for simplified integration:

```javascript
// SDK integration example
import { OakPlatform } from '@oaknetwork/platform-sdk';

const platform = new OakPlatform({
  platformId: 'my-platform',
  adminWallet: adminWallet,
  network: 'alfajores'
});

// Create campaign
const campaign = await platform.createCampaign({
  creator: userAddress,
  goalAmount: ethers.utils.parseEther('10000'),
  deadline: Math.floor(Date.now() / 1000) + 86400 * 30,
  platformData: {
    category: 'technology',
    tags: ['blockchain', 'defi']
  }
});
```

### Proxy Integration

Platforms can act as proxies for users:

```javascript
// Proxy integration example
class PlatformProxy {
  async createCampaignForUser(userAddress, campaignData) {
    // Platform-specific processing
    const processedData = await this.processCampaignData(campaignData);
    
    // Create campaign on behalf of user
    const campaign = await this.oakNetwork.createCampaign({
      ...processedData,
      creator: userAddress
    });
    
    // Store platform-specific data
    await this.storePlatformData(campaign.address, processedData);
    
    return campaign;
  }
  
  async processCampaignData(campaignData) {
    // Add platform-specific data
    return {
      ...campaignData,
      platformData: {
        ...campaignData.platformData,
        platformId: this.platformId,
        processedAt: Date.now()
      }
    };
  }
}
```

## Platform Events

### Campaign Events

```solidity
// Platform-specific campaign events
event PlatformCampaignCreated(
    bytes32 indexed platformHash,
    address indexed campaignAddress,
    address indexed creator
);

event PlatformCampaignPaused(
    bytes32 indexed platformHash,
    address indexed campaignAddress,
    string reason
);

event PlatformCampaignCancelled(
    bytes32 indexed platformHash,
    address indexed campaignAddress,
    string reason
);
```

### Contribution Events

```solidity
// Platform-specific contribution events
event PlatformContribution(
    bytes32 indexed platformHash,
    address indexed campaignAddress,
    address indexed contributor,
    uint256 amount,
    uint256 platformFee
);

event PlatformRefund(
    bytes32 indexed platformHash,
    address indexed campaignAddress,
    address indexed contributor,
    uint256 amount
);
```

### Event Handling

```javascript
// Event handling example
class PlatformEventHandler {
  constructor(platform) {
    this.platform = platform;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Listen for campaign events
    this.platform.on('PlatformCampaignCreated', (event) => {
      this.handleCampaignCreated(event);
    });
    
    this.platform.on('PlatformContribution', (event) => {
      this.handleContribution(event);
    });
  }
  
  async handleCampaignCreated(event) {
    // Update platform database
    await this.updateCampaignDatabase(event);
    
    // Notify platform users
    await this.notifyUsers(event);
  }
  
  async handleContribution(event) {
    // Update contribution tracking
    await this.updateContributionTracking(event);
    
    // Calculate platform fee
    const platformFee = event.amount * this.platform.feePercent / 100;
    await this.recordPlatformFee(platformFee);
  }
}
```

## Platform Fees

### Fee Structure

Platforms can set their own fee percentage, subject to protocol limits:

```solidity
// Platform fee configuration
uint256 public constant MAX_PLATFORM_FEE = 10; // 10% maximum

function setPlatformFee(
    bytes32 platformHash,
    uint256 feePercent
) external onlyPlatformAdmin(platformHash) {
    require(feePercent <= MAX_PLATFORM_FEE, "Fee too high");
    
    s_platforms[platformHash].feePercent = feePercent;
    emit PlatformFeeUpdated(platformHash, feePercent);
}
```

### Fee Collection

Platform fees are automatically collected and distributed:

```solidity
// Fee collection in treasury
function _collectFees(uint256 amount) internal {
    uint256 protocolFee = amount * PROTOCOL_FEE_PERCENT / 100;
    uint256 platformFee = amount * platformFeePercent / 100;
    uint256 campaignAmount = amount - protocolFee - platformFee;
    
    // Transfer fees
    TOKEN.safeTransfer(PROTOCOL_TREASURY, protocolFee);
    TOKEN.safeTransfer(platformTreasury, platformFee);
    
    // Update campaign amount
    s_pledgedAmount += campaignAmount;
}
```

### Fee Management

```javascript
// Fee management example
class PlatformFeeManager {
  constructor(platform) {
    this.platform = platform;
    this.feeHistory = [];
  }
  
  async setPlatformFee(feePercent) {
    // Validate fee
    if (feePercent > 10) {
      throw new Error('Fee cannot exceed 10%');
    }
    
    // Update on-chain
    await this.platform.setPlatformFee(feePercent);
    
    // Update local state
    this.platform.feePercent = feePercent;
    
    // Log change
    this.feeHistory.push({
      feePercent,
      timestamp: Date.now()
    });
  }
  
  async getFeeEarnings(platformHash) {
    // Get total fees earned
    const treasury = await this.platform.getTreasury(platformHash);
    return await treasury.getPlatformFees();
  }
}
```

## Platform Security

### Access Control

```solidity
// Platform admin access control
modifier onlyPlatformAdmin(bytes32 platformHash) {
    require(
        msg.sender == s_platforms[platformHash].adminAddress,
        "Not platform admin"
    );
    _;
}

// Platform-specific functions
function pausePlatformCampaigns(
    bytes32 platformHash,
    string calldata reason
) external onlyPlatformAdmin(platformHash) {
    // Pause all platform campaigns
    // Implementation details...
}
```

### Security Best Practices

1. **Secure Admin Keys**: Use hardware wallets for platform admin keys
2. **Multi-signature**: Consider multi-signature for critical operations
3. **Regular Audits**: Audit platform integration code regularly
4. **Access Monitoring**: Monitor platform admin activities
5. **Emergency Procedures**: Have plans for emergency situations

## Platform Analytics

### Campaign Metrics

```javascript
// Platform analytics example
class PlatformAnalytics {
  async getCampaignMetrics(platformHash) {
    const campaigns = await this.getPlatformCampaigns(platformHash);
    
    return {
      totalCampaigns: campaigns.length,
      successfulCampaigns: campaigns.filter(c => c.successful).length,
      totalRaised: campaigns.reduce((sum, c) => sum + c.totalRaised, 0),
      averageGoal: campaigns.reduce((sum, c) => sum + c.goalAmount, 0) / campaigns.length,
      successRate: this.calculateSuccessRate(campaigns)
    };
  }
  
  async getContributionMetrics(platformHash) {
    const contributions = await this.getPlatformContributions(platformHash);
    
    return {
      totalContributions: contributions.length,
      totalAmount: contributions.reduce((sum, c) => sum + c.amount, 0),
      averageContribution: this.calculateAverageContribution(contributions),
      topContributors: this.getTopContributors(contributions)
    };
  }
}
```

## Platform Examples

### E-commerce Platform

```javascript
// E-commerce platform integration
class EcommercePlatform {
  async createProductCampaign(productId, campaignData) {
    // Get product information
    const product = await this.getProduct(productId);
    
    // Create campaign with product data
    const campaign = await this.createCampaign({
      ...campaignData,
      platformData: {
        productId,
        category: product.category,
        tags: product.tags,
        images: product.images
      }
    });
    
    // Link campaign to product
    await this.linkCampaignToProduct(productId, campaign.address);
    
    return campaign;
  }
}
```

### Social Media Platform

```javascript
// Social media platform integration
class SocialMediaPlatform {
  async createSocialCampaign(userId, campaignData) {
    // Get user profile
    const user = await this.getUser(userId);
    
    // Create campaign with social data
    const campaign = await this.createCampaign({
      ...campaignData,
      platformData: {
        userId,
        username: user.username,
        followers: user.followers,
        socialLinks: user.socialLinks
      }
    });
    
    // Share on social media
    await this.shareCampaign(campaign, user);
    
    return campaign;
  }
}
```

## Next Steps

- [Platform Integration Guide](/docs/guides/platform-integration) - Step-by-step integration
- [Platform SDK](/docs/guides/platform-sdk) - Using the platform SDK
- [Platform Examples](/docs/guides/platform-examples) - Real-world examples


