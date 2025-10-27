# AllOrNothing

The `AllOrNothing` treasury contract implements an "all-or-nothing" crowdfunding model where campaign creators only receive funds if the campaign reaches its goal. If the goal is not met, all backers can claim refunds. This contract also manages a reward system where backers receive NFTs representing their pledges.

## Overview

```solidity
contract AllOrNothing is
    IReward,
    BaseTreasury,
    TimestampChecker,
    ERC721Burnable
{
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    
    mapping(uint256 => uint256) private s_tokenToTotalCollectedAmount;
    mapping(uint256 => uint256) private s_tokenToPledgedAmount;
    mapping(bytes32 => Reward) private s_reward;
    Counters.Counter private s_tokenIdCounter;
    Counters.Counter private s_rewardCounter;
    string private s_name;
    string private s_symbol;
}
```

## Key Features

- **All-or-Nothing Model**: Funds only released if goal is met
- **Reward System**: Backers receive rewards based on pledge amount
- **NFT Receipts**: ERC721 tokens track backer pledges
- **Refund Mechanism**: Backers can claim refunds if campaign fails
- **Fee Distribution**: Protocol and platform fees automatically distributed
- **Shipping Support**: Separate tracking for pledge amount and shipping fees

## State Variables

### Pledge Tracking

| Variable | Type | Description |
|----------|------|-------------|
| `s_tokenToTotalCollectedAmount` | `mapping(uint256 => uint256)` | Total collected amount (pledge + shipping) per token |
| `s_tokenToPledgedAmount` | `mapping(uint256 => uint256)` | Pledged amount per token ID |
| `s_tokenIdCounter` | `Counters.Counter` | Counter for generating unique token IDs |

### Reward Management

| Variable | Type | Description |
|----------|------|-------------|
| `s_reward` | `mapping(bytes32 => Reward)` | Reward details by name |
| `s_rewardCounter` | `Counters.Counter` | Counter for tracking rewards |

### Token Metadata

| Variable | Type | Description |
|----------|------|-------------|
| `s_name` | `string` | Treasury contract name |
| `s_symbol` | `string` | Treasury contract symbol |

## Functions

### Initialization

#### Constructor

```solidity
constructor() ERC721("", "");
```

**Effects:**
- Initializes ERC721 base contract
- Empty name/symbol set in constructor (set during initialization)

#### Initialize

```solidity
function initialize(
    bytes32 _platformHash,
    address _infoAddress,
    string calldata _name,
    string calldata _symbol
) external initializer;
```

**Parameters:**
- `_platformHash`: Platform identifier
- `_infoAddress`: CampaignInfo contract address
- `_name`: Treasury contract name
- `_symbol`: Treasury contract symbol

**Effects:**
- Initializes base treasury contract
- Sets name and symbol for ERC721
- Initializes campaign connection

**Requirements:**
- Can only be called once (initializer modifier)
- Name and symbol must be non-empty strings

### Reward Management

#### Get Reward

```solidity
function getReward(bytes32 rewardName) external view returns (Reward memory reward);
```

**Parameters:**
- `rewardName`: Reward identifier

**Returns:**
- Complete reward structure with value, items, quantities

**Usage:**
- Query reward details before pledging
- Check available reward tiers
- Display reward information to users

#### Add Rewards

```solidity
function addRewards(
    bytes32[] calldata rewardNames,
    Reward[] calldata rewards
) external onlyCampaignOwner onlyBeforeLaunch;
```

**Parameters:**
- `rewardNames`: Array of reward identifiers
- `rewards`: Array of reward structures

**Effects:**
- Adds rewards to campaign
- Emits `RewardsAdded` event

**Requirements:**
- Only callable by campaign owner
- Must be called before campaign launch
- Reward names must be unique
- Arrays must have matching lengths

#### Remove Reward

```solidity
function removeReward(bytes32 rewardName) external onlyCampaignOwner onlyBeforeLaunch;
```

**Parameters:**
- `rewardName`: Reward identifier to remove

**Effects:**
- Removes reward from campaign
- Emits `RewardRemoved` event

**Requirements:**
- Only callable by campaign owner
- Must be before launch
- Reward must exist

### Contribution Functions

#### Pledge For A Reward

```solidity
function pledgeForAReward(
    bytes32 rewardName,
    uint256 amount,
    uint256 shippingFee
) external whenNotPaused whenNotCancelled returns (uint256 tokenId);
```

**Parameters:**
- `rewardName`: Reward tier identifier
- `amount`: Pledge amount (must meet reward minimum)
- `shippingFee`: Shipping fee (can be zero)

**Returns:**
- `tokenId`: ERC721 token ID representing pledge

**Effects:**
- Transfers tokens from backer
- Mints ERC721 receipt NFT
- Records pledge and shipping amounts
- Emits `Receipt` event

**Requirements:**
- Campaign must be active (not paused/cancelled)
- Campaign must be between launch and deadline
- Amount must meet minimum for reward tier
- Reward must exist
- Backer must approve token transfer

#### Check Success Condition

```solidity
function _checkSuccessCondition() internal view override returns (bool);
```

**Returns:**
- True if total raised >= campaign goal

**Logic:**
- Compares total pledged amount to goal from CampaignInfo
- Used to determine if fees should be disbursed
- All funds remain if condition not met

### Withdrawal Functions

#### Withdraw Funds

```solidity
function withdraw() external onlyCampaignOwner;
```

**Effects:**
- Transfers all collected funds to campaign owner
- Can only be called if campaign successful

**Requirements:**
- Only callable by campaign owner
- Campaign must have reached goal
- Funds must be successfully disbursed (fees paid)

#### Claim Refund

```solidity
function claimRefund(uint256 tokenId) external;
```

**Parameters:**
- `tokenId`: ERC721 token ID of pledge

**Effects:**
- Burns the NFT receipt
- Transfers pledged amount back to backer
- Emits `RefundClaimed` event

**Requirements:**
- Campaign must not have reached goal
- Token must not already be claimed
- Token must be owned by caller or approved
- Campaign must be past deadline

### Fee Distribution

#### Disburse Fees

```solidity
function disburseFees() external override;
```

**Effects:**
- Distributes protocol and platform fees
- Transfers remaining funds to campaign owner
- Marks fees as disbursed

**Requirements:**
- Campaign must have reached goal
- Fees must not already be disbursed

**Distribution:**
1. Protocol fee → Protocol treasury
2. Platform fee → Platform treasury
3. Remaining funds → Campaign owner

### Query Functions

#### Get Pledge Amount

```solidity
function getPledgeAmount(uint256 tokenId) external view returns (uint256);
```

**Parameters:**
- `tokenId`: ERC721 token ID

**Returns:**
- Pledged amount for the token

#### Get Total Collected Amount

```solidity
function getTotalCollectedAmount(uint256 tokenId) external view returns (uint256);
```

**Parameters:**
- `tokenId`: ERC721 token ID

**Returns:**
- Total amount (pledge + shipping) for the token

#### Get All Rewards

```solidity
function getAllRewards() external view returns (bytes32[] memory, Reward[] memory);
```

**Returns:**
- Array of reward names and corresponding reward structures

**Usage:**
- Display all available rewards
- Show complete reward catalog

#### Name & Symbol

```solidity
function name() public view override returns (string memory);
function symbol() public view override returns (string memory);
```

**Returns:**
- ERC721 name and symbol

## Data Structures

### Reward

```solidity
struct Reward {
    uint256 rewardValue;        // Minimum pledge amount
    bool isRewardTier;          // Whether this is a reward tier
    bytes32[] itemId;           // Item identifiers
    uint256[] itemValue;        // Item values
    uint256[] itemQuantity;     // Item quantities
}
```

**Fields:**
- `rewardValue`: Minimum pledge amount to receive this reward
- `isRewardTier`: Whether this tier offers physical/digital rewards
- `itemId`: Identifiers of items included in reward
- `itemValue`: Individual item values
- `itemQuantity`: Number of each item included

## Events

### Receipt

```solidity
event Receipt(
    address indexed backer,
    bytes32 indexed reward,
    uint256 pledgeAmount,
    uint256 shippingFee,
    uint256 tokenId,
    bytes32[] rewards
);
```

**Emitted when:** Backer makes a pledge
**Includes:** Backer address, reward tier, amounts, token ID, all rewards earned

### RewardsAdded

```solidity
event RewardsAdded(bytes32[] rewardNames, Reward[] rewards);
```

**Emitted when:** New rewards added to campaign

### RewardRemoved

```solidity
event RewardRemoved(bytes32 indexed rewardName);
```

**Emitted when:** Reward removed from campaign

### RefundClaimed

```solidity
event RefundClaimed(uint256 tokenId, uint256 refundAmount, address claimer);
```

**Emitted when:** Backer claims refund for failed campaign

## Errors

### AllOrNothingUnAuthorized

```solidity
error AllOrNothingUnAuthorized();
```

**Emitted when:** Unauthorized action attempted

### AllOrNothingInvalidInput

```solidity
error AllOrNothingInvalidInput();
```

**Emitted when:** Invalid input provided

### AllOrNothingNotSuccessful

```solidity
error AllOrNothingNotSuccessful();
```

**Emitted when:** Withdrawal attempted on unsuccessful campaign

### AllOrNothingNotClaimable

```solidity
error AllOrNothingNotClaimable(uint256 tokenId);
```

**Emitted when:** Refund cannot be claimed for token

### AllOrNothingRewardExists

```solidity
error AllOrNothingRewardExists();
```

**Emitted when:** Attempting to add duplicate reward

## Usage Examples

### Adding Rewards

```javascript
// Campaign owner adds reward tiers before launch
const rewards = [
  {
    rewardValue: ethers.utils.parseEther('50'),
    isRewardTier: true,
    itemId: [
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('product')),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('t-shirt'))
    ],
    itemValue: [
      ethers.utils.parseEther('40'),
      ethers.utils.parseEther('10')
    ],
    itemQuantity: [1, 1]
  },
  {
    rewardValue: ethers.utils.parseEther('100'),
    isRewardTier: true,
    itemId: [
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('product')),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('exclusive-badge'))
    ],
    itemValue: [
      ethers.utils.parseEther('80'),
      ethers.utils.parseEther('20')
    ],
    itemQuantity: [1, 1]
  }
];

const rewardNames = rewards.map(r => 
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes('tier-' + r.rewardValue))
);

await treasury.addRewards(rewardNames, rewards);
```

### Making a Pledge

```javascript
// Backer pledges for a reward
const treasury = await ethers.getContractAt('AllOrNothing', treasuryAddress);
const rewardName = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('tier-50'));

// Check reward details
const reward = await treasury.getReward(rewardName);
console.log('Minimum pledge:', ethers.utils.formatEther(reward.rewardValue));

// Approve token transfer
const token = await ethers.getContractAt('IERC20', tokenAddress);
await token.approve(treasuryAddress, reward.rewardValue);

// Make pledge
const pledgeAmount = reward.rewardValue;
const shippingFee = ethers.utils.parseEther('10');

const tx = await treasury.pledgeForAReward(rewardName, pledgeAmount, shippingFee);
const receipt = await tx.wait();

// Extract token ID from event
const tokenId = receipt.events.find(
  e => e.event === 'Receipt'
).args.tokenId;

console.log('Pledge confirmed. Token ID:', tokenId);
```

### Checking Campaign Status

```javascript
// Check if campaign reached goal
const totalRaised = await campaign.getTotalRaisedAmount();
const goal = await campaign.getGoalAmount();
const isSuccessful = totalRaised >= goal;

console.log('Raised:', ethers.utils.formatEther(totalRaised));
console.log('Goal:', ethers.utils.formatEther(goal));
console.log('Successful:', isSuccessful);

// Check deadline
const deadline = await campaign.getDeadline();
const now = Math.floor(Date.now() / 1000);
const hasEnded = now >= deadline;

if (hasEnded && !isSuccessful) {
  console.log('Campaign failed. Refunds available.');
}
```

### Claiming Refunds

```javascript
// Backer claims refund after failed campaign
const treasury = await ethers.getContractAt('AllOrNothing', treasuryAddress);
const tokenId = 1; // Backer's NFT token ID

// Check pledge amount
const pledgeAmount = await treasury.getPledgeAmount(tokenId);
console.log('Refund amount:', ethers.utils.formatEther(pledgeAmount));

// Claim refund
const tx = await treasury.claimRefund(tokenId);
await tx.wait();

console.log('Refund claimed successfully');
// NFT is burned, tokens returned
```

### Withdrawing Funds (Owner)

```javascript
// Campaign owner withdraws funds after successful campaign
const treasury = await ethers.getContractAt('AllOrNothing', treasuryAddress);

// Disburse fees first
await treasury.disburseFees();

// Withdraw remaining funds
const tx = await treasury.withdraw();
await tx.wait();

console.log('Funds withdrawn successfully');
```

### Querying Rewards

```javascript
// Get all available rewards
const [names, rewards] = await treasury.getAllRewards();

names.forEach((name, index) => {
  const reward = rewards[index];
  console.log('Reward:', ethers.utils.hexValue(name));
  console.log('Minimum pledge:', ethers.utils.formatEther(reward.rewardValue));
  console.log('Items included:', reward.itemQuantity);
});
```

## Funding Model Behavior

### Successful Campaign

```javascript
// Scenario: Campaign reaches goal
// - All backers keep their rewards
// - Fees are disbursed to protocol/platform
// - Campaign owner receives remaining funds
// - No refunds available

// Steps:
1. Campaign ends and goal reached
2. Owner calls disburseFees() → distributes protocol/platform fees
3. Owner calls withdraw() → receives remaining funds
4. Backers keep their NFT receipts
```

### Failed Campaign

```javascript
// Scenario: Campaign does not reach goal
// - All backers can claim refunds
// - No fees are collected
// - Campaign owner receives nothing
// - NFTs are burned when claimed

// Steps:
1. Campaign ends without reaching goal
2. Backers call claimRefund(tokenId)
3. NFT is burned, pledge amount returned
4. No fees collected, no funds disbursed
```

## Security Considerations

### Token Safety

- Uses SafeERC20 for safe token transfers
- No reentrancy vulnerabilities
- Checks-Effects-Interactions pattern

### Access Control

- Campaign owner has limited access (rewards, withdrawal)
- Only valid rewards can be added
- Only before launch can rewards be modified

### Pledge Protection

- Cannot pledge after deadline
- Cannot pledge less than reward minimum
- Total amount (pledge + shipping) recorded separately

### Refund Safety

- Can only claim refund once
- Token must be owned by claimer
- Refunds only available if goal not met

## Integration Notes

### With CampaignInfo

```javascript
// Treasury reads from CampaignInfo
const goal = await campaign.getGoalAmount();
const launchTime = await campaign.getLaunchTime();
const deadline = await campaign.getDeadline();

// Treasury updates total raised
// Treasury checks campaign state for withdrawals
```

### With GlobalParams

```javascript
// Read protocol configuration
const protocolFee = await globalParams.getProtocolFeePercent();
const tokenAddress = await globalParams.getTokenAddress();

// Get platform configuration
const platformFee = await globalParams.getPlatformFeePercent(platformHash);
```

### Event Monitoring

```javascript
// Monitor pledges
treasury.on('Receipt', (backer, reward, pledgeAmount, shippingFee, tokenId, rewards, event) => {
  console.log('New pledge from:', backer);
  console.log('Amount:', ethers.utils.formatEther(pledgeAmount));
  console.log('Token ID:', tokenId.toString());
  
  // Update UI
  updateCampaignProgress();
  
  // Store in database
  await database.savePledge(backer, tokenId, pledgeAmount);
});

// Monitor refunds
treasury.on('RefundClaimed', (tokenId, refundAmount, claimer, event) => {
  console.log('Refund claimed for token:', tokenId.toString());
  console.log('Amount:', ethers.utils.formatEther(refundAmount));
  
  // Update database
  await database.markRefundClaimed(tokenId);
});
```

## Best Practices

### Reward Design

- Clear, achievable reward tiers
- Reasonable minimum pledge amounts
- Include physical items, digital goods, or experiences
- Consider shipping costs in reward pricing

### Campaign Management

- Set realistic funding goals
- Add rewards before launch
- Cannot modify rewards after launch
- Monitor campaign progress

### User Experience

- Display all rewards clearly
- Show funding progress
- Make refund process easy
- Provide clear deadlines

## Next Steps

- [KeepWhatsRaised](./keep-whats-raised.md) - Alternative funding model
- [BaseTreasury](./base-treasury.md) - Treasury base contract
- [TreasuryFactory](./treasury-factory.md) - Treasury deployment
- [Reward System](../concepts/rewards.md) - Reward design guide

