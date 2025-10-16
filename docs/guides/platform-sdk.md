# Platform SDK

The Oak Network Platform SDK provides tools and libraries for integrating crowdfunding capabilities into your platform.

## Overview

The Platform SDK simplifies the integration process by providing:
- Pre-built components and hooks
- TypeScript definitions
- Error handling utilities
- Testing helpers

## Installation

```bash
npm install @oaknetwork/platform-sdk
# or
yarn add @oaknetwork/platform-sdk
# or
pnpm add @oaknetwork/platform-sdk
```

## Quick Start

### Basic Setup

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

## Next Steps

- [Platform Integration](/docs/guides/platform-integration) - Complete integration guide
- [Platform Examples](/docs/guides/platform-examples) - Real-world examples
- [API Reference](/docs/api/overview) - Complete API documentation
