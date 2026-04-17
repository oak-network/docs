---
sidebar_label: Advanced Patterns
sidebar_position: 8
---

# Advanced Patterns

> **Source:** Full executable TypeScript in `contract/src/examples/06-advanced-patterns/`. This page summarizes the flow — read the source for complete per-step code.

## The Story

ArtFund has grown. They now manage dozens of active campaigns, multiple treasury contracts, and a growing catalog of physical products that need to be tracked on-chain. Their engineering team needs to optimize for performance and handle complex operational requirements:

- **Performance** — Loading a dashboard that reads data from 10+ contracts should not require 10+ separate RPC calls. They need to batch reads into a single network round-trip.
- **Multi-role operations** — Some operations on the same contract require different signers. For example, the protocol admin disburses fees, but the campaign creator withdraws funds.
- **Physical product tracking** — Campaigns that ship physical goods need to register item metadata (dimensions, weight, category) in the ItemRegistry so logistics and customs can be automated.
- **Protocol configuration** — The platform needs to read global and platform-scoped protocol parameters like buffer times, payment expirations, and campaign duration minimums.

## Steps

### Step 1: Multicall — Batch Reads

Instead of making N separate RPC calls, batch them into one round-trip using `oak.multicall()`. Each read is wrapped in a lazy function so they execute together.

```typescript
const gp = oak.globalParams(process.env.GLOBAL_PARAMS_ADDRESS! as `0x${string}`);
const campaign = oak.campaignInfo(process.env.CAMPAIGN_INFO_ADDRESS! as `0x${string}`);

const [platformCount, protocolFee, goalAmount, totalRaised, deadline] = await oak.multicall([
  () => gp.getNumberOfListedPlatforms(),
  () => gp.getProtocolFeePercent(),
  () => campaign.getGoalAmount(),
  () => campaign.getTotalRaisedAmount(),
  () => campaign.getDeadline(),
]);
```

### Step 2: Per-Entity Signer

In a browser dApp, the signer is resolved after the user connects their wallet. Pass it when creating the entity — all writes on that entity automatically use it.

```typescript
import { createWallet } from "@oaknetwork/contracts-sdk";

// Start with a read-only client
const oak = createOakContractsClient({
  chainId: CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl: process.env.RPC_URL!,
});

// User connects their wallet — resolve the signer
const userSigner = createWallet(userPrivateKey, process.env.RPC_URL!, oak.config.chain);

// Create an entity with the user's signer
const treasury = oak.allOrNothingTreasury(treasuryAddress, { signer: userSigner });

// Writes automatically use userSigner
// await treasury.pledgeForAReward(backerAddr, pledgeToken, 0n, [rewardHash]);
```

### Step 3: Per-Call Signer

Different operations on the same contract require different signers. Pass the signer as the last argument on each call.

```typescript
const adminSigner = createWallet(
  process.env.ADMIN_PRIVATE_KEY! as `0x${string}`,
  process.env.RPC_URL!,
  oak.config.chain,
);
const creatorSigner = createWallet(
  process.env.CREATOR_PRIVATE_KEY! as `0x${string}`,
  process.env.RPC_URL!,
  oak.config.chain,
);

const treasury = oak.allOrNothingTreasury(treasuryAddress);

// Admin disburses fees
const feeTxHash = await treasury.disburseFees({ signer: adminSigner });
await oak.waitForReceipt(feeTxHash);

// Creator withdraws funds
const withdrawTxHash = await treasury.withdraw({ signer: creatorSigner });
await oak.waitForReceipt(withdrawTxHash);
```

### Step 4: Item Registry

For campaigns that ship physical products, register item metadata (dimensions, weight, category) on-chain. Supports single and batch registration.

```typescript
const vaseItemId = keccak256(toHex("handcrafted-vase-001"));

const vaseItem: Item = {
  actualWeight: 2500n,     // 2500 grams
  height: 300n,            // 300 mm
  width: 150n,
  length: 150n,
  category: keccak256(toHex("ceramics")),
  declaredCurrency: toHex("USD", { size: 32 }),
};

await itemRegistry.addItem(vaseItemId, vaseItem);

// Batch registration
const batchTxHash = await itemRegistry.addItemsBatch(
  [item1Id, item2Id],
  [item1, item2],
);
```

### Step 5: Registry Keys — Protocol Configuration

The protocol stores configuration values (buffer times, payment expirations, minimum campaign duration) in a data registry. Values can be global or scoped to a specific platform.

```typescript
import {
  DATA_REGISTRY_KEYS,
  scopedToPlatform,
} from "@oaknetwork/contracts-sdk";

// Global values
const bufferTime = await gp.getFromRegistry(DATA_REGISTRY_KEYS.BUFFER_TIME);
const maxPaymentExpiration = await gp.getFromRegistry(
  DATA_REGISTRY_KEYS.MAX_PAYMENT_EXPIRATION,
);
const minCampaignDuration = await gp.getFromRegistry(
  DATA_REGISTRY_KEYS.MINIMUM_CAMPAIGN_DURATION,
);

// Platform-scoped values
const platformHash = keccak256(toHex("artfund"));
const platformBufferTime = await gp.getFromRegistry(
  scopedToPlatform(DATA_REGISTRY_KEYS.BUFFER_TIME, platformHash),
);
```

### Step 6: Non-Blocking Receipt Lookup

`oak.getReceipt(txHash)` fetches the receipt for an already-mined transaction without blocking. Unlike `waitForReceipt` (which polls until inclusion), `getReceipt` returns immediately with the receipt or `null` if not yet mined. Useful for webhooks, indexers, and resuming past sessions.

```typescript
const receipt = await oak.getReceipt(txHash);

if (receipt) {
  console.log("Mined at block:", receipt.blockNumber);
  console.log("Gas used:", receipt.gasUsed);
} else {
  console.log("Transaction not yet mined — try again later");
}
```

### Step 7: Browser Wallet (MetaMask / Injected)

For frontend applications using MetaMask, Coinbase Wallet, or any browser extension that injects `window.ethereum`, the SDK provides `createBrowserProvider` and `getSigner`. Two usage patterns:

**Pattern A — Full configuration** — provider and signer passed to the client up front, so every entity inherits the wallet.

```typescript
import {
  createBrowserProvider,
  getSigner,
  getChainFromId,
} from "@oaknetwork/contracts-sdk";

const chain = getChainFromId(CHAIN_IDS.CELO_TESTNET_SEPOLIA);
const provider = createBrowserProvider(window.ethereum, chain);
const signer = await getSigner(window.ethereum, chain);

const oak = createOakContractsClient({ chain, provider, signer });
```

**Pattern B — Per-entity override** — read-only client, signer attached to a specific entity.

```typescript
const oak = createOakContractsClient({
  chainId: CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl: "https://forno.celo-sepolia.celo-testnet.org",
});

const signer = await getSigner(window.ethereum, chain);
const treasury = oak.allOrNothingTreasury(treasuryAddress, { signer });
```

### Step 8: Privy Wallet

Privy embedded wallets expose an EIP-1193 provider. Pass it to viem's `custom` transport for both `createPublicClient` and `createWalletClient`, then pass `chain`, `provider`, and `signer` into `createOakContractsClient` — the same full-config pattern as the browser wallet example.

```typescript
import {
  createPublicClient,
  createWalletClient,
  custom,
  getChainFromId,
} from "@oaknetwork/contracts-sdk";

const chain = getChainFromId(CHAIN_IDS.CELO_TESTNET_SEPOLIA);
await wallet.switchChain(chain.id);

const ethereumProvider = await wallet.getEthereumProvider();

const provider = createPublicClient({
  chain,
  transport: custom(ethereumProvider),
});

const signer = createWalletClient({
  chain,
  transport: custom(ethereumProvider),
  account: wallet.address as `0x${string}`,
});

const oak = createOakContractsClient({ chain, provider, signer });
```

## Related

- [Multicall](/docs/contracts-sdk/multicall)
- [Item Registry](/docs/contracts-sdk/item-registry)
- [Client](/docs/contracts-sdk/client)
- [Utilities](/docs/contracts-sdk/utilities)
