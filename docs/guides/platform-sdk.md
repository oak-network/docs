# Platform SDK

> **Note**: The Oak Network Platform SDK is currently under development and not yet available. This documentation outlines the planned SDK features and will be updated when the SDK is released.

## Overview

The Platform SDK will provide tools and libraries for integrating crowdfunding capabilities into your platform, simplifying the integration process by providing:

- Pre-built components and hooks
- TypeScript definitions
- Error handling utilities
- Testing helpers

## Current Status

The SDK is planned for future release. For now, please use our [Smart Contract Integration Guide](/docs/guides/create-campaign) for direct contract integration.

## Planned Features

### Installation

```bash
npm install @oaknetwork/platform-sdk
# or
yarn add @oaknetwork/platform-sdk
# or
pnpm add @oaknetwork/platform-sdk
```

### Quick Start

```typescript
import { OakPlatform } from '@oaknetwork/platform-sdk';

const oak = new OakPlatform({
  network: 'celo',
  rpcUrl: 'https://celo-alfajores.infura.io/v3/your-project-id',
  privateKey: process.env.PRIVATE_KEY,
});
```

### Create a Campaign

```typescript
import { useCreateCampaign } from '@oaknetwork/platform-sdk';

function CreateCampaign() {
  const { createCampaign, loading, error } = useCreateCampaign();

  const handleCreate = async () => {
    try {
      const campaign = await createCampaign({
        title: 'My Campaign',
        description: 'Campaign description',
        goal: 10000, // 10,000 USDC
        duration: 30, // 30 days
        creator: '0x...',
      });
      console.log('Campaign created:', campaign);
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creating...' : 'Create Campaign'}
    </button>
  );
}
```

## Components

### Campaign Components

```typescript
import { CampaignCard, CampaignList, CampaignDetails } from '@oaknetwork/platform-sdk';

// Display a single campaign
<CampaignCard campaign={campaign} />

// Display a list of campaigns
<CampaignList campaigns={campaigns} />

// Show detailed campaign information
<CampaignDetails campaignId={campaignId} />
```

### Contribution Components

```typescript
import { ContributionForm, ContributionHistory } from '@oaknetwork/platform-sdk';

// Allow users to contribute
<ContributionForm campaignId={campaignId} />

// Show contribution history
<ContributionHistory address={userAddress} />
```

## Hooks

### Campaign Hooks

```typescript
import { 
  useCampaign, 
  useCampaigns, 
  useCreateCampaign,
  useUpdateCampaign 
} from '@oaknetwork/platform-sdk';

// Get a single campaign
const { campaign, loading, error } = useCampaign(campaignId);

// Get multiple campaigns
const { campaigns, loading, error } = useCampaigns({
  creator: '0x...',
  status: 'active'
});

// Create a new campaign
const { createCampaign, loading, error } = useCreateCampaign();

// Update an existing campaign
const { updateCampaign, loading, error } = useUpdateCampaign();
```

### Contribution Hooks

```typescript
import { 
  useContribute, 
  useContributions,
  useContributionHistory 
} from '@oaknetwork/platform-sdk';

// Contribute to a campaign
const { contribute, loading, error } = useContribute();

// Get contributions for a campaign
const { contributions, loading, error } = useContributions(campaignId);

// Get user's contribution history
const { contributions, loading, error } = useContributionHistory(userAddress);
```

## Error Handling

```typescript
import { OakError, ErrorCodes } from '@oaknetwork/platform-sdk';

try {
  await createCampaign(campaignData);
} catch (error) {
  if (error instanceof OakError) {
    switch (error.code) {
      case ErrorCodes.INSUFFICIENT_FUNDS:
        console.error('Insufficient funds');
        break;
      case ErrorCodes.CAMPAIGN_NOT_FOUND:
        console.error('Campaign not found');
        break;
      default:
        console.error('Unknown error:', error.message);
    }
  }
}
```

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCreateCampaign } from '@oaknetwork/platform-sdk';

test('should create campaign', async () => {
  const { result } = renderHook(() => useCreateCampaign());
  
  await act(async () => {
    await result.current.createCampaign({
      title: 'Test Campaign',
      description: 'Test Description',
      goal: 1000,
      duration: 7,
      creator: '0x...',
    });
  });
  
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(null);
});
```

## Alternative: Direct Smart Contract Integration

Since the SDK is not yet available, you can integrate directly with our smart contracts:

- [Create Your First Campaign](/docs/guides/create-campaign) - Direct contract integration guide
- [Smart Contract Reference](/docs/contracts/overview) - Complete contract documentation
- [Platform Integration](/docs/guides/platform-integration) - Platform integration patterns

## Roadmap

The SDK development is planned for Q2 2024. Key milestones include:

- **Q1 2024**: Core contract functionality and testing
- **Q2 2024**: SDK development and testing
- **Q3 2024**: SDK release and documentation
- **Q4 2024**: Advanced SDK features and optimizations

## Next Steps

- [Smart Contract Integration](/docs/guides/create-campaign) - Use direct contract integration
- [Platform Integration](/docs/guides/platform-integration) - Complete integration guide
- [Smart Contract Reference](/docs/contracts/overview) - Complete contract documentation