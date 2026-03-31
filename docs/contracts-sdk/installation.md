# Installation

The `@oaknetwork/contracts` package is published on npm. Install it with your preferred package manager.

```bash
pnpm add @oaknetwork/contracts
```

> You can also use `npm install @oaknetwork/contracts` or `yarn add @oaknetwork/contracts`.

## Requirements

- `@oaknetwork/contracts` **>= 1.0.0**
- Node.js 18 or later
- TypeScript 5.x recommended (the SDK ships type declarations)

The SDK depends on [viem](https://viem.sh) for blockchain interactions. It is included as a dependency — you do not need to install it separately.

## Supported chains

The SDK ships a `CHAIN_IDS` constant with all supported networks:

```typescript
import { CHAIN_IDS } from '@oaknetwork/contracts';

CHAIN_IDS.ETHEREUM_MAINNET; // 1
CHAIN_IDS.CELO_MAINNET; // 42220
CHAIN_IDS.ETHEREUM_TESTNET_SEPOLIA; // 11155111
CHAIN_IDS.ETHEREUM_TESTNET_GOERLI; // 5
CHAIN_IDS.CELO_TESTNET_SEPOLIA; // 11142220
```

| Chain            | Chain ID   | Use for                                     |
| ---------------- | ---------- | ------------------------------------------- |
| Celo Sepolia     | `11142220` | Testnet development and integration testing |
| Celo Mainnet     | `42220`    | Production deployments                      |
| Ethereum Sepolia | `11155111` | Testnet development on Ethereum             |
| Ethereum Mainnet | `1`        | Production deployments on Ethereum          |
| Ethereum Goerli  | `5`        | Legacy testnet (deprecated)                 |

:::tip Start with testnet
Use `CHAIN_IDS.CELO_TESTNET_SEPOLIA` for development. You can get testnet tokens from the [Celo faucet](https://faucet.celo.org).
:::

## Environment variables

Store your private key in an environment variable — never hardcode it.

```bash
PRIVATE_KEY=0x...your-private-key
RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

| Variable      | Required | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `PRIVATE_KEY` | Yes      | 0x-prefixed private key for the signer account |
| `RPC_URL`     | Yes      | RPC endpoint for the target chain              |

> Install `dotenv` if you want to load variables from a `.env` file: `pnpm add dotenv`. Then add `import 'dotenv/config'` at the top of your entry file.
