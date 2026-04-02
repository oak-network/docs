# Error Handling

Contract calls can revert with on-chain errors. The SDK decodes raw revert data into typed error classes with decoded arguments and human-readable recovery hints.

## Decoding revert errors

Use `parseContractError()` to decode raw revert data from a failed transaction or simulation:

```typescript
import { parseContractError, getRevertData } from '@oaknetwork/contracts-sdk';

function handleError(err) {
  // If the error is already a typed SDK error (thrown by simulate methods)
  if (typeof err?.recoveryHint === 'string') {
    console.error('Reverted:', err.name);
    console.error('Args:', err.args);
    console.error('Hint:', err.recoveryHint);
    return;
  }
  // Otherwise extract raw revert hex from the viem error chain and decode it
  const revertData = getRevertData(err);
  const parsed = parseContractError(revertData ?? '');
  if (parsed) {
    console.error('Reverted:', parsed.name);
    console.error('Args:', parsed.args);
    if (parsed.recoveryHint) console.error('Hint:', parsed.recoveryHint);
    return;
  }
  console.error('Unknown error:', err.message);
}

try {
  const txHash = await factory.createCampaign({ ... });
} catch (err) {
  handleError(err);
}
```

### getRevertData(error)

Walks the error cause chain and extracts the first `0x`-prefixed hex string from `error.data`. Returns `null` if no revert data is found.

### parseContractError(revertData)

Takes a hex string (selector + encoded args) and returns a typed `ContractErrorBase` or `null` if the error is not recognized.

## ContractErrorBase

All typed errors implement this interface:

```typescript
interface ContractErrorBase {
  readonly name: string;                    // e.g. "GlobalParamsUnauthorized"
  readonly args: Record<string, unknown>;   // decoded error arguments
  readonly recoveryHint?: string;           // human-readable suggestion
}
```

## Simulation with error decoding

Use `simulateWithErrorDecode()` to wrap a `simulateContract` call. It catches reverts, decodes them, and re-throws as typed SDK errors:

```typescript
import { simulateWithErrorDecode } from '@oaknetwork/contracts-sdk';

try {
  await simulateWithErrorDecode(() =>
    gp.simulate.enlistPlatform(platformHash, admin, fee, adapter)
  );
  // Safe to send
  const txHash = await gp.enlistPlatform(platformHash, admin, fee, adapter);
} catch (err) {
  if ('recoveryHint' in err) {
    console.error(err.name, '-', err.recoveryHint);
  }
}
```

Or use the `simulate` namespace directly on any entity — it already throws typed errors:

```typescript
try {
  await gp.simulate.enlistPlatform(platformHash, admin, fee, adapter);
} catch (err) {
  console.error(err.name, err.recoveryHint);
}
```

## Error types by contract

### GlobalParams errors

| Error | When it occurs | Recovery hint |
|---|---|---|
| `GlobalParamsInvalidInput` | Invalid address, fee, or bytes input | Check addresses, fee percent, and platform bytes |
| `GlobalParamsPlatformAlreadyListed` | Enlisting a platform that exists | Use a different platform hash or update |
| `GlobalParamsPlatformNotListed` | Operating on unlisted platform | Enlist the platform first |
| `GlobalParamsUnauthorized` | Caller is not protocol admin | Use the admin account |
| `GlobalParamsPlatformAdminNotSet` | Platform admin not configured | Set the platform admin address first |
| `GlobalParamsPlatformFeePercentIsZero` | Zero fee percent | Fee must be greater than zero |
| `GlobalParamsCurrencyHasNoTokens` | Currency has no accepted tokens | Add at least one token |
| `GlobalParamsTokenNotInCurrency` | Token not in currency list | Use an approved token |
| `GlobalParamsPlatformLineItemTypeNotFound` | Line item type not registered | Register the line item type first |
| `GlobalParamsPlatformDataAlreadySet` | Data key already exists | Use a different key |
| `GlobalParamsPlatformDataNotSet` | Data key not found | Add platform data first |
| `GlobalParamsPlatformDataSlotTaken` | Data slot occupied | Use a different key |
| `GlobalParamsCurrencyTokenLengthMismatch` | Array length mismatch | Match currencies and tokens array lengths |

### CampaignInfoFactory errors

| Error | When it occurs | Recovery hint |
|---|---|---|
| `CampaignInfoFactoryInvalidInput` | Invalid campaign creation params | Check creator, platforms, and data |
| `CampaignInfoFactoryPlatformNotListed` | Selected platform not in GlobalParams | Enlist the platform first |
| `CampaignInfoFactoryCampaignWithSameIdentifierExists` | Duplicate identifier hash | Use a different identifier |
| `CampaignInfoFactoryCampaignInitializationFailed` | Clone failed to initialize | Check campaign data and implementation |
| `CampaignInfoInvalidTokenList` | Currency tokens don't match GlobalParams | Fix token list for campaign currency |

### CampaignInfo errors

| Error | When it occurs | Recovery hint |
|---|---|---|
| `CampaignInfoInvalidInput` | Invalid update input | Check input values |
| `CampaignInfoIsLocked` | Campaign is locked | Cannot modify locked campaigns |
| `CampaignInfoUnauthorized` | Caller not authorized | Use the campaign owner account |
| `CampaignInfoPlatformNotSelected` | Platform not selected | Select the platform first |
| `CampaignInfoPlatformAlreadyApproved` | Platform already approved | Platform is already set up |
| `CampaignInfoInvalidPlatformUpdate` | Invalid platform update | Check platform hash and data |

### PaymentTreasury errors

| Error | When it occurs | Recovery hint |
|---|---|---|
| `PaymentTreasuryInvalidInput` | Invalid payment parameters | Check payment data |
| `PaymentTreasuryPaymentAlreadyExist` | Duplicate payment ID | Use a unique payment ID |
| `PaymentTreasuryPaymentNotExist` | Payment not found | Check the payment ID |
| `PaymentTreasuryPaymentAlreadyConfirmed` | Payment already confirmed | Cannot re-confirm |
| `PaymentTreasuryPaymentAlreadyExpired` | Payment expired | Create a new payment |
| `PaymentTreasuryPaymentNotConfirmed` | Payment not yet confirmed | Confirm the payment first |
| `PaymentTreasuryPaymentNotClaimable` | Payment does not meet refund eligibility | May not be confirmed, expired, or claim window not reached |
| `PaymentTreasuryTokenNotAccepted` | Token not accepted | Use an accepted token |
| `PaymentTreasuryUnAuthorized` | Caller not authorized | Use authorized account |
| `PaymentTreasuryCampaignInfoIsPaused` | Campaign is paused | Unpause the campaign first |
| `PaymentTreasurySuccessConditionNotFulfilled` | Goal not reached | Goal amount must be reached before withdrawing |
| `PaymentTreasuryCryptoPayment` | Wrong flow for crypto payment | Use `processCryptoPayment()` instead |
| `PaymentTreasuryInsufficientBalance` | Insufficient token balance | Fund the account |
| `PaymentTreasuryInsufficientFundsForFee` | Insufficient funds for withdrawal fee | Ensure treasury has enough balance for the fee |
| `PaymentTreasuryFeeNotDisbursed` | Fees not yet disbursed | Call `disburseFees()` first |
| `PaymentTreasuryAlreadyWithdrawn` | Already withdrawn | Cannot withdraw twice |
| `PaymentTreasuryExpirationExceedsMax` | Payment expiration too long | Use a shorter expiration time |
| `PaymentTreasuryClaimWindowNotReached` | Claim attempted too early | Wait until the claimableAt timestamp |
| `PaymentTreasuryNoFundsToClaim` | No funds available | No refundable funds |

### AllOrNothing errors

| Error | When it occurs | Recovery hint |
|---|---|---|
| `AllOrNothingInvalidInput` | Invalid parameters | Check input values |
| `AllOrNothingNotSuccessful` | Goal not met | Cannot withdraw — goal was not reached |
| `AllOrNothingNotClaimable` | Refund not available | Refund conditions not met |
| `AllOrNothingRewardExists` | Duplicate reward name | Use a different reward name |
| `AllOrNothingTokenNotAccepted` | Token not accepted | Use an accepted token |
| `AllOrNothingUnAuthorized` | Caller not authorized | Use authorized account |
| `AllOrNothingFeeAlreadyDisbursed` | Fees already disbursed | Already processed |
| `AllOrNothingFeeNotDisbursed` | Fees not disbursed | Call `disburseFees()` first |
| `AllOrNothingTransferFailed` | Token transfer failed | Check balances and allowances |
| `TreasurySuccessConditionNotFulfilled` | Goal not met | Goal amount must be reached before withdrawing |

### KeepWhatsRaised errors

| Error | When it occurs | Recovery hint |
|---|---|---|
| `KeepWhatsRaisedInvalidInput` | Invalid parameters | Check input values |
| `KeepWhatsRaisedConfigLocked` | Configuration is locked | Wait for lock period to expire |
| `KeepWhatsRaisedDisabled` | Feature is disabled | Cannot perform this operation |
| `KeepWhatsRaisedAlreadyEnabled` | Already enabled | Already configured |
| `KeepWhatsRaisedAlreadyClaimed` | Already claimed | Cannot claim twice |
| `KeepWhatsRaisedAlreadyWithdrawn` | Already withdrawn | Cannot withdraw twice |
| `KeepWhatsRaisedNotClaimable` | Not claimable | Conditions not met for claim |
| `KeepWhatsRaisedNotClaimableAdmin` | Admin claim conditions not met | Ensure campaign is in the correct state |
| `KeepWhatsRaisedRewardExists` | Duplicate reward name | Use a different reward name |
| `KeepWhatsRaisedTokenNotAccepted` | Token not accepted | Use an accepted token |
| `KeepWhatsRaisedUnAuthorized` | Caller not authorized | Use authorized account |
| `KeepWhatsRaisedPledgeAlreadyProcessed` | Pledge already processed | Cannot re-process |
| `KeepWhatsRaisedInsufficientFundsForFee` | Insufficient funds for fee | Ensure sufficient balance |
| `KeepWhatsRaisedInsufficientFundsForWithdrawalAndFee` | Insufficient funds for withdrawal + fee | Reduce withdrawal or wait for more pledges |
| `KeepWhatsRaisedDisbursementBlocked` | Disbursement blocked | Conditions not met |

### TreasuryFactory errors

| Error | When it occurs | Recovery hint |
|---|---|---|
| `TreasuryFactoryUnauthorized` | Caller not authorized | Use authorized account |
| `TreasuryFactoryInvalidAddress` | Invalid contract address | Check the address |
| `TreasuryFactoryInvalidKey` | Invalid implementation key | Check implementation ID |
| `TreasuryFactoryImplementationNotSet` | Implementation not registered | Register the implementation first |
| `TreasuryFactoryImplementationNotSetOrApproved` | Not set or not approved | Register and approve the implementation |
| `TreasuryFactoryTreasuryCreationFailed` | Treasury deploy failed | Check campaign and implementation |
| `TreasuryFactoryTreasuryInitializationFailed` | Treasury init failed | Check configuration |
| `TreasuryFactorySettingPlatformInfoFailed` | Platform info update failed | Check platform configuration |

### Shared errors (cross-contract)

| Error | When it occurs | Recovery hint |
|---|---|---|
| `AccessCheckerUnauthorized` | Generic access control failure | Check permissions |
| `AdminAccessCheckerUnauthorized` | Not an admin | Only admins can do this |
| `CurrentTimeIsGreater` | Timestamp in the past | Provide a future timestamp |
| `CurrentTimeIsLess` | Time not yet reached | Wait until the specified time |
| `CurrentTimeIsNotWithinRange` | Outside allowed time window | Operation only valid in range |
| `TreasuryCampaignInfoIsPaused` | Campaign is paused | Unpause the campaign first |
| `TreasuryFeeNotDisbursed` | Fees not disbursed | Call `disburseFees()` first |
| `TreasuryTransferFailed` | Token transfer failed | Check balances and allowances |

## Checking error types

```typescript
import {
  GlobalParamsPlatformNotListedError,
  CampaignInfoFactoryInvalidInputError,
} from '@oaknetwork/contracts-sdk';

try {
  await factory.createCampaign(params);
} catch (err) {
  if (err instanceof GlobalParamsPlatformNotListedError) {
    console.error('Platform not listed:', err.args.platformHash);
  } else if (err instanceof CampaignInfoFactoryInvalidInputError) {
    console.error('Invalid input:', err.recoveryHint);
  }
}
```

## getRecoveryHint

Convenience function to extract the recovery hint from any typed error:

```typescript
import { getRecoveryHint } from '@oaknetwork/contracts-sdk';

const hint = getRecoveryHint(err);
if (hint) console.log('Suggestion:', hint);
```
