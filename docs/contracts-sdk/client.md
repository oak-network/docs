# Client Configuration

`createOakContractsClient` supports several **config and signer patterns**. You can mix them: for example, a read-only client with a per-entity signer for one contract, or a keyed client with per-call overrides for specific transactions.

## Pattern 1 — Simple (`chainId` + `rpcUrl` + `privateKey`)

Full read/write access using a raw private key. Suitable for backend services and scripts.

```typescript
import { createOakContractsClient, CHAIN_IDS } from '@oaknetwork/contracts';

const oak = createOakContractsClient({
  chainId:    CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl:     'https://forno.celo-sepolia.celo-testnet.org',
  privateKey: '0x...', // 0x-prefixed 32-byte hex string
});

const gp = oak.globalParams('0x...');
const admin = await gp.getProtocolAdminAddress(); // read
await gp.enlistPlatform(hash, adminAddr, fee, adapter); // write — uses client key
```

| Field | Type | Required | Description |
|---|---|---|---|
| `chainId` | `number` | Yes | Numeric chain ID (use `CHAIN_IDS.*` constants) |
| `rpcUrl` | `string` | Yes | RPC endpoint URL for the chain |
| `privateKey` | `` `0x${string}` `` | Yes | 0x-prefixed private key for the signer |
| `options` | `Partial<OakContractsClientOptions>` | No | Client-level overrides |

## Pattern 2 — Read-only (`chainId` + `rpcUrl`, no `privateKey`)

No private key required. All read methods work normally; write and simulate methods throw immediately — no RPC call is made. The error is thrown by `requireSigner()`; the message starts with `No signer configured.` and explains how to pass a client key, full-config signer, or per-entity signer (for example `oak.globalParams(address, { signer })`).

```typescript
import { createOakContractsClient, CHAIN_IDS } from '@oaknetwork/contracts';

const oak = createOakContractsClient({
  chainId: CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl:  'https://forno.celo-sepolia.celo-testnet.org',
});

const gp = oak.globalParams('0x...');
const admin = await gp.getProtocolAdminAddress(); // reads work fine
await gp.transferOwnership('0x...'); // throws (no signer — see requireSigner message)
```

| Field | Type | Required | Description |
|---|---|---|---|
| `chainId` | `number` | Yes | Numeric chain ID (use `CHAIN_IDS.*` constants) |
| `rpcUrl` | `string` | Yes | RPC endpoint URL for the chain |
| `options` | `Partial<OakContractsClientOptions>` | No | Client-level overrides |

## Pattern 3 — Per-entity signer override

Pass a signer when creating an entity. Every write and simulate call on that entity uses the provided signer — you do not pass it again on each call. Use this when the signer is resolved **after** the client is created (browser wallets, Privy, etc.).

```typescript
import { createOakContractsClient, createWallet, CHAIN_IDS } from '@oaknetwork/contracts';

const RPC_URL = 'https://forno.celo-sepolia.celo-testnet.org';

const oak = createOakContractsClient({
  chainId: CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl:  RPC_URL,
});

// Resolve signer after wallet connect
const signer = createWallet(privateKey, RPC_URL, oak.config.chain);
// or: const signer = await getSigner(window.ethereum, oak.config.chain);

// All write/simulate calls on gp use this signer
const gp = oak.globalParams('0x...', { signer });
const admin = await gp.getProtocolAdminAddress(); // read
await gp.simulate.enlistPlatform(hash, addr, fee, adapter); // simulate — uses signer
await gp.enlistPlatform(hash, addr, fee, adapter); // write — uses signer
```

## Pattern 4 — Per-call signer override

The entity has no fixed signer. Pass a different signer for a single write or simulate call as the **last optional argument**. Use this when different operations on the same contract need different signers (multi-sig flows, role switching).

```typescript
const gp = oak.globalParams('0x...'); // no entity-level signer

// Read — no signer needed
const admin = await gp.getProtocolAdminAddress();

// Write/simulate — signer only for this call
await gp.simulate.enlistPlatform(hash, addr, fee, adapter, { signer });
await gp.enlistPlatform(hash, addr, fee, adapter, { signer });

// Different call, different signer
await gp.transferOwnership(newOwner, { signer: anotherWallet });

// No override and no client/entity signer → throws (same requireSigner error as above)
await gp.delistPlatform(hash);
```

## Pattern 5 — Full (bring your own clients)

Pass pre-built viem `PublicClient` and `WalletClient` directly. Use this for custom transports, account abstraction, or when you already manage viem clients elsewhere.

```typescript
import {
  createOakContractsClient,
  createPublicClient,
  createWalletClient,
  http,
  getChainFromId,
  CHAIN_IDS,
} from '@oaknetwork/contracts';

const RPC_URL = 'https://forno.celo-sepolia.celo-testnet.org';

const chain    = getChainFromId(CHAIN_IDS.CELO_TESTNET_SEPOLIA);
const provider = createPublicClient({ chain, transport: http(RPC_URL) });
const signer   = createWalletClient({ account, chain, transport: http(RPC_URL) });

const oak = createOakContractsClient({ chain, provider, signer });
```

| Field | Type | Required | Description |
|---|---|---|---|
| `chain` | `number \| Chain` | Yes | Numeric chain ID or viem `Chain` object |
| `provider` | `PublicClient` | Yes | Viem `PublicClient` for on-chain reads |
| `signer` | `WalletClient` | Yes | Viem `WalletClient` with an attached account |
| `options` | `Partial<OakContractsClientOptions>` | No | Client-level overrides |

### Browser wallet with full configuration

If you prefer to construct the client with provider and signer up front (instead of Pattern 3 on a read-only or minimal client):

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

## Signer resolution priority

When a write or simulate method runs, the signer is resolved in this order:

1. **Per-call** `options.signer` — highest priority  
2. **Per-entity** `signer` passed to the entity factory (e.g. `oak.globalParams(addr, { signer })`)  
3. **Client-level** `walletClient` from `createOakContractsClient` (simple or full config with a wallet)  
4. **Throws** an `Error` from `requireSigner()` (message begins with `No signer configured.`) if none of the above is set  

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
| `walletClient` | `WalletClient \| null` | Viem `WalletClient` for custom writes (`null` for read-only clients) |

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
