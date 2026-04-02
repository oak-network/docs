# Quickstart

This guide walks you from zero to a working contract interaction in under 5 minutes.

## 1. Install the package

```bash
pnpm add @oaknetwork/contracts-sdk
```

> You can also use `npm install @oaknetwork/contracts-sdk` or `yarn add @oaknetwork/contracts-sdk`.

## 2. Create a client

```typescript
import { createOakContractsClient, CHAIN_IDS } from '@oaknetwork/contracts-sdk';

const oak = createOakContractsClient({
  chainId: CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl: 'https://forno.celo-sepolia.celo-testnet.org',
  privateKey: '0x...',
});
```

`createOakContractsClient` sets up a viem `PublicClient` for reads and a `WalletClient` for writes. Pass a contract address to any entity factory to start interacting with it.

:::tip Need testnet tokens?
Get free Celo Sepolia tokens from the [Celo faucet](https://faucet.celo.org) to cover gas fees on testnet.
:::

## 3. Read from a contract

```typescript
const GLOBAL_PARAMS_ADDRESS = '0x...'; // deployed GlobalParams address

const gp = oak.globalParams(GLOBAL_PARAMS_ADDRESS);

const admin = await gp.getProtocolAdminAddress();
const fee = await gp.getProtocolFeePercent();

console.log('Protocol admin:', admin);
console.log('Protocol fee (bps):', fee); // e.g. 100n = 1%
```

Save steps 2 and 3 together in a file (e.g. `index.ts`) and run it:

```bash
npx tsx index.ts
```

## 4. Write to a contract

Write methods return a transaction hash (`Hex`). Use `oak.waitForReceipt()` to wait for confirmation.

```typescript
import { keccak256, toHex } from '@oaknetwork/contracts-sdk';

const PLATFORM_HASH = keccak256(toHex('my-platform'));

const txHash = await gp.enlistPlatform(
  PLATFORM_HASH,
  '0x...adminAddress',
  200n, // 2% fee in basis points
  '0x...adapterAddress',
);

const receipt = await oak.waitForReceipt(txHash);
console.log('Mined in block:', receipt.blockNumber);
```

## 5. Create a campaign

```typescript
import { keccak256, toHex, getCurrentTimestamp, addDays } from '@oaknetwork/contracts-sdk';

const factory = oak.campaignInfoFactory('0x...factoryAddress');

const identifierHash = keccak256(toHex('my-campaign-slug'));
const PLATFORM_HASH = keccak256(toHex('my-platform'));
const CURRENCY = toHex('USD', { size: 32 });
const now = getCurrentTimestamp();

const txHash = await factory.createCampaign({
  creator: '0x...creatorAddress',
  identifierHash,
  selectedPlatformHash: [PLATFORM_HASH],
  campaignData: {
    launchTime: now + 3_600n, // 1 hour from now
    deadline: addDays(now, 30), // 30 days from now
    goalAmount: 1_000_000n,
    currency: CURRENCY,
  },
  nftName: 'My Campaign NFT',
  nftSymbol: 'MCN',
  nftImageURI: 'https://example.com/nft.png',
  contractURI: 'https://example.com/contract.json',
});

const receipt = await oak.waitForReceipt(txHash);
const campaignAddress = await factory.identifierToCampaignInfo(identifierHash);
console.log('Campaign deployed at:', campaignAddress);
```

## 6. Handle errors

Contract reverts can be decoded into typed errors with recovery hints:

```typescript
import { parseContractError, getRevertData } from '@oaknetwork/contracts-sdk';

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

## 7. Using a Privy wallet

If your app uses [Privy](https://www.privy.io/) for authentication and embedded wallets, wire Privy's EIP-1193 provider into viem with the `custom` transport, then pass `chain`, `provider`, and `signer` to `createOakContractsClient`—[Pattern 5 (full configuration)](/docs/contracts-sdk/client#pattern-5--full-bring-your-own-clients) in [Client Configuration](/docs/contracts-sdk/client).

The example below uses the `useWallets` hook from `@privy-io/react-auth` to pick a wallet; swap in whatever selection logic your app uses.

```typescript
import {
  createOakContractsClient,
  createPublicClient,
  createWalletClient,
  custom,
  getChainFromId,
  CHAIN_IDS,
  keccak256,
  toHex,
  getCurrentTimestamp,
  addDays,
} from '@oaknetwork/contracts-sdk';
import { useWallets } from '@privy-io/react-auth';

const { wallets } = useWallets();
const wallet = wallets[0]; // or select by address / connector

const chain = getChainFromId(CHAIN_IDS.CELO_TESTNET_SEPOLIA);
await wallet.switchChain(chain.id); // ensure the wallet is on this chain

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

const factory = oak.campaignInfoFactory('0x...factoryAddress');

const txHash = await factory.createCampaign({
  creator: wallet.address as `0x${string}`,
  identifierHash: keccak256(toHex('my-campaign-slug')),
  selectedPlatformHash: [keccak256(toHex('my-platform'))],
  campaignData: {
    launchTime: getCurrentTimestamp() + 3_600n,
    deadline: addDays(getCurrentTimestamp(), 30),
    goalAmount: 1_000_000n,
    currency: toHex('USD', { size: 32 }),
  },
  nftName: 'My Campaign NFT',
  nftSymbol: 'MCN',
  nftImageURI: 'https://example.com/nft.png',
  contractURI: 'https://example.com/contract.json',
});

const receipt = await oak.waitForReceipt(txHash);
console.log('Campaign created:', receipt.blockNumber);
```

:::info Unsupported chains
If Privy does not include your chain in its default networks, register it in the Privy provider. See [Configuring EVM networks](https://docs.privy.io/basics/react/advanced/configuring-evm-networks) in the Privy documentation.
:::

> For per-entity and per-call signers, browser wallets, and the full list of patterns, see [Client Configuration](/docs/contracts-sdk/client).

## What to read next

- [Client Configuration](/docs/contracts-sdk/client) — all setup patterns, per-entity and per-call signers, resolution order, and browser wallets
- [GlobalParams](/docs/contracts-sdk/global-params) — protocol-wide configuration reads and writes
- [CampaignInfoFactory](/docs/contracts-sdk/campaign-info-factory) — deploying new campaigns
- [Error Handling](/docs/contracts-sdk/error-handling) — typed error decoding and recovery hints
- [Utilities](/docs/contracts-sdk/utilities) — hashing, encoding, time helpers, and constants
