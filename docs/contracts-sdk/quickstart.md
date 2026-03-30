# Quickstart

This guide walks you from zero to a working contract interaction in under 5 minutes.

## 1. Install the package

```bash
pnpm add @oaknetwork/contracts dotenv
pnpm add -D tsx
```

## 2. Set your credentials

Create a `.env` file in your project root:

```bash
PRIVATE_KEY=0x...your-private-key
RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

:::tip Need testnet tokens?
Get free Celo Sepolia tokens from the [Celo faucet](https://faucet.celo.org) to cover gas fees on testnet.
:::

## 3. Create a client

```typescript
import 'dotenv/config';
import { createOakContractsClient, CHAIN_IDS } from '@oaknetwork/contracts';

const oak = createOakContractsClient({
  chainId:    CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl:     process.env.RPC_URL!,
  privateKey: process.env.PRIVATE_KEY! as `0x${string}`,
});
```

`createOakContractsClient` sets up a viem `PublicClient` for reads and a `WalletClient` for writes. Pass a contract address to any entity factory to start interacting with it.

## 4. Read from a contract

```typescript
const GLOBAL_PARAMS_ADDRESS = '0x...'; // deployed GlobalParams address

const gp = oak.globalParams(GLOBAL_PARAMS_ADDRESS);

const admin = await gp.getProtocolAdminAddress();
const fee   = await gp.getProtocolFeePercent();

console.log('Protocol admin:', admin);
console.log('Protocol fee (bps):', fee); // e.g. 100n = 1%
```

Save steps 3 and 4 together in a file (e.g. `index.ts`) and run it:

```bash
npx tsx index.ts
```

## 5. Write to a contract

Write methods return a transaction hash (`Hex`). Use `oak.waitForReceipt()` to wait for confirmation.

```typescript
import { keccak256, toHex } from '@oaknetwork/contracts';

const PLATFORM_HASH = keccak256(toHex('my-platform'));

const txHash = await gp.enlistPlatform(
  PLATFORM_HASH,
  '0x...adminAddress',
  200n,  // 2% fee in basis points
  '0x...adapterAddress',
);

const receipt = await oak.waitForReceipt(txHash);
console.log('Mined in block:', receipt.blockNumber);
```

## 6. Create a campaign

```typescript
import {
  keccak256,
  toHex,
  getCurrentTimestamp,
  addDays,
} from '@oaknetwork/contracts';

const factory = oak.campaignInfoFactory('0x...factoryAddress');

const identifierHash = keccak256(toHex('my-campaign-slug'));
const PLATFORM_HASH  = keccak256(toHex('my-platform'));
const CURRENCY       = toHex('USD', { size: 32 });
const now            = getCurrentTimestamp();

const txHash = await factory.createCampaign({
  creator:              '0x...creatorAddress',
  identifierHash,
  selectedPlatformHash: [PLATFORM_HASH],
  campaignData: {
    launchTime: now + 3_600n,        // 1 hour from now
    deadline:   addDays(now, 30),    // 30 days from now
    goalAmount: 1_000_000n,
    currency:   CURRENCY,
  },
  nftName:     'My Campaign NFT',
  nftSymbol:   'MCN',
  nftImageURI: 'https://example.com/nft.png',
  contractURI: 'https://example.com/contract.json',
});

const receipt = await oak.waitForReceipt(txHash);
const campaignAddress = await factory.identifierToCampaignInfo(identifierHash);
console.log('Campaign deployed at:', campaignAddress);
```

## 7. Handle errors

Contract reverts can be decoded into typed errors with recovery hints:

```typescript
import { parseContractError, getRevertData } from '@oaknetwork/contracts';

try {
  await factory.createCampaign({ ... });
} catch (err) {
  const revertData = getRevertData(err);
  if (revertData) {
    const parsed = parseContractError(revertData);
    if (parsed) {
      console.error('Reverted:', parsed.name);
      console.error('Hint:', parsed.recoveryHint);
      return;
    }
  }
  console.error('Unknown error:', err);
}
```

> For the full error reference, see [Error Handling](/docs/contracts-sdk/error-handling).

## What to read next

- [Client Configuration](/docs/contracts-sdk/client) — all setup patterns, per-entity and per-call signers, resolution order, and browser wallets
- [GlobalParams](/docs/contracts-sdk/global-params) — protocol-wide configuration reads and writes
- [CampaignInfoFactory](/docs/contracts-sdk/campaign-info-factory) — deploying new campaigns
- [Error Handling](/docs/contracts-sdk/error-handling) — typed error decoding and recovery hints
- [Utilities](/docs/contracts-sdk/utilities) — hashing, encoding, time helpers, and constants
