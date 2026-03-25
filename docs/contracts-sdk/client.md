# Client Configuration

The `createOakContractsClient` factory accepts two configuration shapes: **simple** (for quick setup) and **full** (for advanced use cases like browser wallets).

## Simple configuration

Pass a `chainId`, `rpcUrl`, and `privateKey`. The SDK creates viem clients internally.

```typescript
import { createOakContractsClient, CHAIN_IDS } from '@oaknetwork/contracts';

const oak = createOakContractsClient({
  chainId:    CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl:     'https://forno.celo-sepolia.celo-testnet.org',
  privateKey: '0x...',
});
```

| Field | Type | Required | Description |
|---|---|---|---|
| `chainId` | `number` | Yes | Numeric chain ID (use `CHAIN_IDS.*` constants) |
| `rpcUrl` | `string` | Yes | RPC endpoint URL for the chain |
| `privateKey` | `` `0x${string}` `` | Yes | 0x-prefixed private key for the signer |
| `options` | `Partial<OakContractsClientOptions>` | No | Client-level overrides |

## Full configuration

Bring your own viem `PublicClient` and `WalletClient`. Use this when you need custom transport settings, a browser wallet, or an externally managed signer.

```typescript
import {
  createOakContractsClient,
  createPublicClient,
  createWalletClient,
  http,
  getChainFromId,
  CHAIN_IDS,
} from '@oaknetwork/contracts';

const chain    = getChainFromId(CHAIN_IDS.CELO_TESTNET_SEPOLIA);
const provider = createPublicClient({ chain, transport: http('https://forno.celo-sepolia.celo-testnet.org') });
const signer   = createWalletClient({ account, chain, transport: http('https://forno.celo-sepolia.celo-testnet.org') });

const oak = createOakContractsClient({ chain, provider, signer });
```

| Field | Type | Required | Description |
|---|---|---|---|
| `chain` | `number \| Chain` | Yes | Numeric chain ID or viem `Chain` object |
| `provider` | `PublicClient` | Yes | Viem `PublicClient` for on-chain reads |
| `signer` | `WalletClient` | Yes | Viem `WalletClient` with an attached account |
| `options` | `Partial<OakContractsClientOptions>` | No | Client-level overrides |

## Browser wallet (frontend)

For frontend integrations using MetaMask or other injected wallets:

```typescript
import {
  createOakContractsClient,
  createBrowserProvider,
  getSigner,
  getChainFromId,
  CHAIN_IDS,
} from '@oaknetwork/contracts';

const chain    = getChainFromId(CHAIN_IDS.CELO_TESTNET_SEPOLIA);
const provider = createBrowserProvider(window.ethereum, chain);
const signer   = await getSigner(window.ethereum, chain);

const oak = createOakContractsClient({ chain, provider, signer });
```

## Client options

| Option | Type | Default | Description |
|---|---|---|---|
| `timeout` | `number` | `30000` | Timeout in milliseconds for transport calls and `waitForTransactionReceipt` |

```typescript
const oak = createOakContractsClient({
  chainId:    CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl:     'https://forno.celo-sepolia.celo-testnet.org',
  privateKey: '0x...',
  options: {
    timeout: 60000, // 60 seconds
  },
});
```

## Client properties

Once created, the client exposes these read-only properties:

| Property | Type | Description |
|---|---|---|
| `config` | `PublicOakContractsClientConfig` | Public chain configuration (no secrets) |
| `options` | `OakContractsClientOptions` | Resolved client options |
| `publicClient` | `PublicClient` | Viem `PublicClient` for custom reads |
| `walletClient` | `WalletClient` | Viem `WalletClient` for custom writes |

## Waiting for receipts

Write methods return a transaction hash (`Hex`). Use `waitForReceipt()` to poll until the transaction is mined.

```typescript
const txHash = await gp.enlistPlatform(platformHash, admin, fee, adapter);

const receipt = await oak.waitForReceipt(txHash);

console.log('Block:', receipt.blockNumber);
console.log('Gas used:', receipt.gasUsed);
console.log('Logs:', receipt.logs.length);
```

The receipt includes:

| Field | Type | Description |
|---|---|---|
| `blockNumber` | `bigint` | Block in which the transaction was mined |
| `gasUsed` | `bigint` | Total gas consumed |
| `logs` | `readonly { topics, data }[]` | Raw log entries from the transaction |
