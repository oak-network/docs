---
sidebar_label: Overview
---

# Contracts SDK

The `@oaknetwork/contracts-sdk` package is a TypeScript SDK for interacting with Oak Network smart contracts. It provides a type-safe client with full read/write access to all Oak protocol contracts, built on top of [viem](https://viem.sh).

:::tip Testnet first
Start by pointing the SDK at Celo Sepolia testnet (`CHAIN_IDS.CELO_TESTNET_SEPOLIA`) to experiment without risking real funds.
:::

:::tip Deployed addresses
You need deployed contract addresses to use this SDK — including factory addresses (for example `CampaignInfoFactory`, `TreasuryFactory`) and any protocol contracts you call through the client. The SDK interacts with Oak Network smart contracts that must already be deployed on-chain. To get your contract addresses and sandbox environment access, contact our team at [support@oaknetwork.org](mailto:support@oaknetwork.org).
:::

## Highlights

- **Flexible signers** — simple keyed client, read-only RPC client, per-entity or per-call signer overrides, or full viem `PublicClient` / `WalletClient` setup including [Privy](https://www.privy.io/) embedded wallets (see [Client Configuration](/docs/contracts-sdk/client))
- **Entity factories** for every on-chain contract: `oak.globalParams(address)`, `oak.campaignInfo(address)`, etc.
- **Typed reads, writes, and simulations** — every method is fully typed with TypeScript
- **Typed error decoding** — `parseContractError()` turns raw revert data into SDK errors with recovery hints
- **Pure utility exports** — hashing, encoding, time helpers, and chain resolution with zero client dependency
- **Tree-shakeable entry points** — import only what you need: `@oaknetwork/contracts-sdk/utils`, `@oaknetwork/contracts-sdk/client`, etc.

## Quick example

```typescript
import { createOakContractsClient, CHAIN_IDS, keccak256, toHex } from '@oaknetwork/contracts-sdk';

const oak = createOakContractsClient({
  chainId: CHAIN_IDS.CELO_TESTNET_SEPOLIA,
  rpcUrl: 'https://forno.celo-sepolia.celo-testnet.org',
  privateKey: '0x...',
});

const gp = oak.globalParams('0x...');

const admin = await gp.getProtocolAdminAddress();
const fee = await gp.getProtocolFeePercent();

console.log('Admin:', admin, 'Fee:', fee);
```

> See the full walkthrough in the [Quickstart](/docs/contracts-sdk/quickstart) guide.

## Contract entities

The SDK ships 8 contract entity modules. Call the factory method on the client to get a typed entity for a deployed contract address.

| Entity                                                             | Factory                                | What it does                                      |
| ------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------- |
| [`GlobalParams`](/docs/contracts-sdk/global-params)                | `oak.globalParams(address)`            | Protocol-wide configuration registry              |
| [`CampaignInfoFactory`](/docs/contracts-sdk/campaign-info-factory) | `oak.campaignInfoFactory(address)`     | Deploy new CampaignInfo contracts                 |
| [`CampaignInfo`](/docs/contracts-sdk/campaign-info)                | `oak.campaignInfo(address)`            | Per-campaign configuration and state              |
| [`TreasuryFactory`](/docs/contracts-sdk/treasury-factory)          | `oak.treasuryFactory(address)`         | Deploy treasury contracts for campaigns           |
| [`PaymentTreasury`](/docs/contracts-sdk/payment-treasury)          | `oak.paymentTreasury(address)`         | Fiat-style payments via a payment gateway         |
| [`AllOrNothing`](/docs/contracts-sdk/all-or-nothing)               | `oak.allOrNothingTreasury(address)`    | Crowdfunding — funds released only if goal is met |
| [`KeepWhatsRaised`](/docs/contracts-sdk/keep-whats-raised)         | `oak.keepWhatsRaisedTreasury(address)` | Crowdfunding — creator keeps all funds raised     |
| [`ItemRegistry`](/docs/contracts-sdk/item-registry)                | `oak.itemRegistry(address)`            | Manage items available for purchase in campaigns  |

## Entry points

| Import path                       | Contents                                    |
| --------------------------------- | ------------------------------------------- |
| `@oaknetwork/contracts-sdk`           | Everything — client, types, utils, errors   |
| `@oaknetwork/contracts-sdk/client`    | `createOakContractsClient` only             |
| `@oaknetwork/contracts-sdk/contracts` | Contract entity factories only              |
| `@oaknetwork/contracts-sdk/utils`     | Utility functions only (no client)          |
| `@oaknetwork/contracts-sdk/errors`    | Error classes and `parseContractError` only |

## Next up

- [Installation](/docs/contracts-sdk/installation) — install the package and configure your chain
- [Quickstart](/docs/contracts-sdk/quickstart) — your first contract interaction in under 5 minutes
- [Client Configuration](/docs/contracts-sdk/client) — patterns, signer overrides, and resolution order
- [Error Handling](/docs/contracts-sdk/error-handling) — typed error decoding and recovery hints
