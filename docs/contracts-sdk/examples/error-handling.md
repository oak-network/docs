---
sidebar_label: Error Handling
sidebar_position: 7
---

# Error Handling

> **Source:** Full executable TypeScript in `contract/src/examples/05-error-handling/`. This page summarizes the flow — read the source for complete per-step code.

## The Story

Kai is a frontend developer at ArtFund, responsible for building the campaign management interface. Before any transaction is sent to the blockchain, Kai wants to:

1. **Preview the outcome** — simulate the transaction against the current chain state to see if it would succeed
2. **Show clear error messages** — if the transaction would fail, explain why in plain language and suggest what to do
3. **Estimate the cost** — display the gas estimate so users know what they will pay before confirming

Kai also needs to handle edge cases that come up in production: What happens when a user without the right permissions tries to perform a restricted action? What about users browsing the app without a connected wallet? How should the UI handle a read-only session?

These patterns are essential for any production application built on Oak Protocol. A good error handling strategy turns cryptic blockchain reverts into helpful user-facing messages.

## Steps

### Step 1: Simulate Before Sending

Simulation calls the contract against the current chain state without broadcasting a transaction. If the simulation succeeds, the real transaction is safe to send. The simulation result includes the predicted return value and gas estimate.

```typescript
const campaignParams = {
  creator: process.env.CREATOR_ADDRESS! as `0x${string}`,
  identifierHash,
  selectedPlatformHash: [platformHash],
  campaignData: {
    launchTime: now + 3600n,
    deadline: addDays(now, 30),
    goalAmount: 1_000_000_000n,
    currency: toHex("USD", { size: 32 }),
  },
  nftName: "Test Campaign",
  nftSymbol: "TC",
  nftImageURI: "ipfs://test",
  contractURI: "ipfs://test-meta",
};

// Simulate first
const simulation = await factory.simulate.createCampaign(campaignParams);
console.log("Estimated gas:", simulation.request.gas);

// Safe to send the real transaction
const txHash = await factory.createCampaign(campaignParams);
```

### Step 2: Prepare Transaction for External Signing

For account-abstraction wallets, Safe multisig, or custom signing flows, use `toPreparedTransaction` to extract raw transaction parameters (`to`, `data`, `value`, `gas`) from a simulation result.

```typescript
import { toPreparedTransaction } from "@oaknetwork/contracts-sdk";

const simulation = await gp.simulate.updatePlatformClaimDelay(
  platformHash,
  604800n, // 7 days
);

const preparedTx = toPreparedTransaction(simulation);
console.log("To:", preparedTx.to);
console.log("Data:", preparedTx.data);
console.log("Gas:", preparedTx.gas);

// Send this to your multisig, bundler, or external signer
```

### Step 3: Catch Typed Errors

When a transaction reverts, the SDK decodes the raw revert data into a typed error class with a human-readable recovery hint. Three patterns:

```typescript
import {
  parseContractError,
  getRevertData,
  getRecoveryHint,
} from "@oaknetwork/contracts-sdk";
import {
  CampaignInfoUnauthorizedError,
  CampaignInfoErrorNames,
  SharedErrorNames,
} from "@oaknetwork/contracts-sdk/errors";

try {
  await campaign.cancelCampaign(toHex("cancelled by user", { size: 32 }));
} catch (error) {
  // Pattern 1: instanceof check for a specific error class
  if (error instanceof CampaignInfoUnauthorizedError) {
    console.error("You are not the campaign owner.");
    console.error("Hint:", error.recoveryHint);
  } else {
    // Pattern 2: parse revert data and match by error-name constant
    const revertData = getRevertData(error);
    const parsed = revertData ? parseContractError(revertData) : null;

    if (parsed) {
      switch (parsed.name) {
        case CampaignInfoErrorNames.IsLocked:
          console.error("Campaign is locked — no modifications allowed.");
          break;
        case SharedErrorNames.PausedError:
          console.error("Campaign is currently paused.");
          break;
        default:
          // Pattern 3: generic fallback
          console.error(`Contract error: ${parsed.name}`);
      }

      const hint = getRecoveryHint(parsed);
      if (hint) console.error("Recovery hint:", hint);
    }
  }
}
```

### Step 4: Handle Read-Only Client

When using a read-only client (no private key), write methods throw immediately with `"No signer configured"` without making an RPC call. Build your UI to handle this gracefully and prompt the user to connect their wallet.

```typescript
const readOnlyOak = createOakContractsClient({
  chainId: CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl: process.env.RPC_URL!,
});

const campaign = readOnlyOak.campaignInfo(campaignInfoAddress);

// Reads work fine
const goalAmount = await campaign.getGoalAmount();

// Writes throw immediately
try {
  await campaign.updateGoalAmount(2_000_000_000n);
} catch (error) {
  if ((error as Error).message.startsWith("No signer configured")) {
    console.error("Connect your wallet to perform this action.");
  }
}
```

### Step 5: Safe Transaction Pattern

A reusable pattern that simulates a transaction, shows the user what will happen, and only sends after simulation passes. Reverts are caught and displayed as user-friendly error messages.

```typescript
async function safeTransaction(
  description: string,
  simulateFn: () => Promise<unknown>,
  executeFn: () => Promise<`0x${string}`>,
) {
  console.log(`Preparing: ${description}`);

  // Step 1: Simulate
  try {
    await simulateFn();
  } catch (error) {
    const revertData = getRevertData(error);
    const parsed = revertData ? parseContractError(revertData) : null;

    if (parsed) {
      console.error(`Transaction would fail: ${parsed.name}`);
      console.error(parsed.recoveryHint || "No recovery hint available");
    } else {
      console.error("Transaction would fail:", (error as Error).message);
    }
    return null;
  }

  // Step 2: Execute
  const txHash = await executeFn();
  const receipt = await oak.waitForReceipt(txHash);
  return receipt;
}

// Usage
await safeTransaction(
  "Update campaign deadline",
  () => campaign.simulate.updateDeadline(newDeadline),
  () => campaign.updateDeadline(newDeadline),
);
```

### Step 6: Simulate With Error Decode

`simulateWithErrorDecode` wraps simulation and error parsing into a single convenience call. If simulation succeeds it returns the `SimulationResult`; if it reverts it throws a typed error with a `recoveryHint` property — no manual `getRevertData` / `parseContractError` needed.

```typescript
import { simulateWithErrorDecode } from "@oaknetwork/contracts-sdk";

try {
  const result = await simulateWithErrorDecode(
    () => treasury.simulate.removeReward(rewardName),
  );

  console.log("Simulation passed — safe to send");
  console.log("Gas estimate:", result.request.gas);

  const txHash = await treasury.removeReward(rewardName);
  await oak.waitForReceipt(txHash);
} catch (error) {
  const typedError = error as { name: string; recoveryHint?: string };
  console.error(`Would revert: ${typedError.name}`);
  if (typedError.recoveryHint) {
    console.error("Hint:", typedError.recoveryHint);
  }
}
```

## Related

- [Error Handling Reference](/docs/contracts-sdk/error-handling)
- [Utilities](/docs/contracts-sdk/utilities)
- [Client](/docs/contracts-sdk/client)
