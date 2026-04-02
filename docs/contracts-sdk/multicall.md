# Multicall

Batch multiple entity read calls into a single RPC round-trip via the on-chain [Multicall3](https://www.multicall3.com/) contract. Instead of awaiting each read individually, pass an array of lazy closures and get all results back in one network call.

:::tip When to use multicall
Use multicall whenever you need two or more read calls that don't depend on each other. A single RPC round-trip is significantly faster — and cheaper on rate-limited RPC providers — than sequential calls.
:::

## Client convenience method

The Oak client exposes `oak.multicall()` directly:

```typescript
const gp = oak.globalParams('0x...');

const [count, fee] = await oak.multicall([
  () => gp.getNumberOfListedPlatforms(),
  () => gp.getProtocolFeePercent(),
]);
```

## Cross-contract batching

Reads from different entities are batched into one RPC call automatically:

```typescript
const gp = oak.globalParams('0x...');
const ci = oak.campaignInfo('0x...');
const aon = oak.allOrNothingTreasury('0x...');

const [platformCount, goalAmount, raisedAmount] = await oak.multicall([
  () => gp.getNumberOfListedPlatforms(),
  () => ci.getGoalAmount(),
  () => aon.getRaisedAmount(),
]);
```

## Standalone utility

You can also import `multicall` as a standalone function — useful outside of the client context or in utility modules:

```typescript
import { multicall } from '@oaknetwork/contracts-sdk';

const gp = oak.globalParams('0x...');

const [platformCount, feePercent, admin] = await multicall([
  () => gp.getNumberOfListedPlatforms(),
  () => gp.getProtocolFeePercent(),
  () => gp.getProtocolAdminAddress(),
]);
```

## How it works

Under the hood, the SDK enables viem's `batch.multicall` transport option. All `readContract` calls dispatched within the same tick are automatically aggregated into a single Multicall3 on-chain call — no raw ABI descriptors needed.

Each closure you pass is a zero-argument function that returns a promise. The SDK collects all the underlying `readContract` calls and dispatches them as a single batched RPC request.

## Rules and limitations

- **Read-only** — multicall only batches read calls. Write transactions cannot be batched this way.
- **Same chain** — all calls in a single `multicall()` must target contracts on the same chain.
- **Lazy closures** — wrap each call in `() => ...` so the SDK can intercept and batch the underlying RPC calls before any promise resolves.
- **Return types are preserved** — TypeScript infers a tuple of the individual return types, so you get full type safety on the destructured results.
