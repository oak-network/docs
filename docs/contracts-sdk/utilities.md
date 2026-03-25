# Utilities

The SDK exports pure utility functions and constants that have no client dependency. Import them from `@oaknetwork/contracts` or `@oaknetwork/contracts/utils`.

```typescript
import {
  keccak256,
  id,
  toHex,
  getCurrentTimestamp,
  addDays,
  getChainFromId,
  parseEther,
  formatEther,
  parseUnits,
  isAddress,
  getAddress,
  stringToHex,
  CHAIN_IDS,
  BPS_DENOMINATOR,
  BYTES32_ZERO,
  DATA_REGISTRY_KEYS,
  scopedToPlatform,
} from '@oaknetwork/contracts';
```

## Hashing

### keccak256(data)

Hashes a string, hex string, or `Uint8Array` using keccak256.

```typescript
const platformHash = keccak256(toHex('my-platform'));
const fromHex      = keccak256('0x1234');
```

### id(input)

Produces a bytes32 hash from a UTF-8 string. Equivalent to Solidity's `keccak256(abi.encodePacked(str))`.

```typescript
const topic = id('Transfer(address,address,uint256)');
```

## Encoding

### toHex(value, options?)

Converts a value to a hex string. Pass `{ size: 32 }` for fixed-length bytes32 encoding.

```typescript
const currency = toHex('USD', { size: 32 }); // bytes32
const raw      = toHex('hello');
```

### stringToHex(value)

Converts a UTF-8 string to a hex string.

```typescript
const hex = stringToHex('hello');
```

### isAddress(value)

Checks if a string is a valid Ethereum address.

```typescript
isAddress('0x1234...'); // true or false
```

### getAddress(value)

Returns the checksummed version of an address. Throws if invalid.

```typescript
const checksummed = getAddress('0x1234...');
```

## Number formatting

### parseEther(value)

Converts a human-readable ether string to `bigint` (wei).

```typescript
const wei = parseEther('1.5'); // 1500000000000000000n
```

### formatEther(value)

Converts a `bigint` (wei) to a human-readable ether string.

```typescript
const eth = formatEther(1500000000000000000n); // "1.5"
```

### parseUnits(value, decimals)

Converts a human-readable string to `bigint` with the specified decimal places.

```typescript
const usdc = parseUnits('100', 6); // 100000000n
```

## Time helpers

### getCurrentTimestamp()

Returns the current Unix time as a `bigint` in seconds.

```typescript
const now = getCurrentTimestamp();
```

### addDays(timestamp, days)

Adds days to a Unix timestamp.

```typescript
const deadline = addDays(getCurrentTimestamp(), 30); // 30 days from now
```

## Chain helpers

### getChainFromId(chainId)

Resolves a numeric chain ID to a viem `Chain` object. Falls back to a minimal definition for unknown IDs.

```typescript
const chain = getChainFromId(CHAIN_IDS.CELO_TESTNET_SEPOLIA);
```

### Browser wallet helpers

For frontend integrations:

```typescript
import {
  createBrowserProvider,
  getSigner,
  createJsonRpcProvider,
  createWallet,
} from '@oaknetwork/contracts';

// Browser (MetaMask, etc.)
const provider = createBrowserProvider(window.ethereum, chain);
const signer   = await getSigner(window.ethereum, chain);

// Server-side
const rpcProvider = createJsonRpcProvider(chain, 'https://rpc-url.com');
const wallet      = createWallet('0x...privateKey', chain, 'https://rpc-url.com');
```

## Constants

### CHAIN_IDS

```typescript
CHAIN_IDS.ETHEREUM_MAINNET          // 1
CHAIN_IDS.CELO_MAINNET              // 42220
CHAIN_IDS.ETHEREUM_TESTNET_SEPOLIA  // 11155111
CHAIN_IDS.ETHEREUM_TESTNET_GOERLI   // 5
CHAIN_IDS.CELO_TESTNET_SEPOLIA      // 11142220
```

### BPS_DENOMINATOR

Basis-points denominator for fee calculations. `10_000n = 100%`.

```typescript
const feeAmount = (raisedAmount * platformFee) / BPS_DENOMINATOR;
```

### BYTES32_ZERO

Zero bytes32 value (`0x0000...0000`). Used as a default or unset marker.

### DATA_REGISTRY_KEYS

Pre-computed keccak256 hashes for common registry keys:

```typescript
DATA_REGISTRY_KEYS.BUFFER_TIME              // keccak256("bufferTime")
DATA_REGISTRY_KEYS.MAX_PAYMENT_EXPIRATION   // keccak256("maxPaymentExpiration")
DATA_REGISTRY_KEYS.CAMPAIGN_LAUNCH_BUFFER   // keccak256("campaignLaunchBuffer")
DATA_REGISTRY_KEYS.MINIMUM_CAMPAIGN_DURATION // keccak256("minimumCampaignDuration")
```

### scopedToPlatform(baseKey, platformHash)

Computes a platform-scoped registry key. Matches the on-chain `DataRegistryKeys.scopedToPlatform`.

```typescript
const scopedKey = scopedToPlatform(
  DATA_REGISTRY_KEYS.BUFFER_TIME,
  keccak256(toHex('my-platform')),
);
const value = await gp.getFromRegistry(scopedKey);
```

## Viem re-exports

The SDK re-exports commonly used viem primitives so you don't need to install viem separately:

```typescript
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  mainnet,
  sepolia,
  goerli,
} from '@oaknetwork/contracts';
```

| Export | Description |
|---|---|
| `createPublicClient` | Create a viem PublicClient for reads |
| `createWalletClient` | Create a viem WalletClient for writes |
| `http` | HTTP transport factory |
| `custom` | Custom transport factory |
| `mainnet` | Ethereum mainnet chain config |
| `sepolia` | Ethereum Sepolia chain config |
| `goerli` | Ethereum Goerli chain config |
