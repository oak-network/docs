# KeepWhatsRaised

The `KeepWhatsRaised` treasury contract implements a "keep what's raised" crowdfunding model where campaign creators receive all funds raised, regardless of whether the campaign reaches its goal. This is an alternative to the all-or-nothing model.

## Overview

```solidity
contract KeepWhatsRaised is AllOrNothing {
    // Inherits all functionality from AllOrNothing
    // Overrides _checkSuccessCondition to always return true
}
```

## Key Difference

The main difference from `AllOrNothing` is the success condition:

- **AllOrNothing**: Funds only released if goal is met
- **KeepWhatsRaised**: Funds always released (success condition always true)

## Purpose

- **Creator-Friendly**: Guaranteed funds regardless of goal achievement
- **Flexible Funding**: Allows partial success scenarios
- **Lower Risk**: Creators benefit from any amount raised
- **Alternative Model**: Choose based on campaign type

## Inheritance

### From AllOrNothing

KeepWhatsRaised inherits all functionality from AllOrNothing:
- Reward system
- ERC721 receipts
- Pledge mechanism
- Fee distribution

### Success Condition Override

```solidity
function _checkSuccessCondition() 
    internal 
    pure 
    override 
    returns (bool) 
{
    return true; // Always successful
}
```

**Effect:**
- Always allows fee disbursement
- Always allows withdrawal
- No refund mechanism needed

## Usage

### Implementation

```javascript
// KeepWhatsRaised behaves like AllOrNothing
// except for success condition

// Check success condition
const isSuccessful = await treasury._checkSuccessCondition();
console.log('Always true:', isSuccessful); // true

// Disburse fees (always allowed)
await treasury.disburseFees();

// Withdraw funds (always allowed if raised any amount)
await treasury.withdraw();
```

### Comparison

```javascript
// AllOrNothing: Only successful if goal reached
const goal = await campaign.getGoalAmount();
const totalRaised = await campaign.getTotalRaisedAmount();
const isSuccessful = totalRaised >= goal;

// KeepWhatsRaised: Always successful
const isSuccessful = true; // Always true
```

## Behaviors

### Fees Always Disbursable

```javascript
// Fees can be disbursed regardless of goal
// No need to check if goal reached
await treasury.disburseFees();

// Protocol and platform fees distributed
// Remaining funds go to creator
```

### Withdrawal Always Allowed

```javascript
// Withdrawal only requires fees to be disbursed
// Does not require goal to be reached
await treasury.disburseFees();
await treasury.withdraw();
```

### No Refunds

```javascript
// No refund mechanism needed
// All funds go to creator even if goal not met
// Backers keep their rewards
// Creator receives funds minus fees
```

## Use Cases

### Small Projects

Suitable for projects that benefit from any funding level:
- Community projects
- Charitable causes
- Open-source initiatives
- Research funding

### Flexible Goals

When goals are soft targets:
- Minimum viable product
- Stretch goals
- Ongoing development
- Incremental improvements

## Differences Summary

| Feature | AllOrNothing | KeepWhatsRaised |
|---------|--------------|-----------------|
| Success Condition | Goal must be met | Always true |
| Refunds | Yes if goal not met | No |
| Withdrawal | Only if goal met | Always |
| Fee Disbursement | Only if goal met | Always |
| Use Case | Hard goals, precise targets | Flexible, any funding helps |

## Integration

### Selecting Treasury Type

```javascript
// Choose based on campaign needs
function createTreasury(campaignType) {
  if (campaignType === 'HARD_GOAL') {
    return AllOrNothing; // Require full goal
  } else if (campaignType === 'FLEXIBLE') {
    return KeepWhatsRaised; // Any funding helps
  }
}
```

### Deployment

```javascript
// Deploy KeepWhatsRaised like AllOrNothing
const treasury = await treasuryFactory.deploy(
  platformHash,
  campaignInfoAddress,
  implementationId, // KeepWhatsRaised implementation
  'My Campaign Treasury',
  'MCT'
);
```

## Security

Same security considerations as AllOrNothing:
- Safe token transfers
- Access control
- State protection
- Gas optimization

## Next Steps

- [AllOrNothing](./all-or-nothing.md) - Strict funding model
- [BaseTreasury](./base-treasury.md) - Base contract functionality
- [TreasuryFactory](./treasury-factory.md) - Deployment process

