# Buy and Sell

Buy and sell operations convert between fiat and crypto. A **buy** (on-ramp) converts fiat currency into stablecoins and deposits them into a customer's wallet. A **sell** (off-ramp) converts stablecoins back into fiat and sends the funds to a customer's bank account or PIX key. These flows are powered by Bridge (on-ramp) and Avenia (off-ramp).

```typescript
import { createOakClient, createBuyService, createSellService } from '@oaknetwork/api';

const client = createOakClient({ ... });

const buy = createBuyService(client);   // on-ramp: fiat → crypto
const sell = createSellService(client); // off-ramp: crypto → fiat
```

---

## Buy (on-ramp)

Convert fiat to crypto via Bridge.

### Methods

| Method | Description |
|---|---|
| `create(request)` | Create a buy transaction |

### Create a buy

```typescript
const result = await buy.create({
  provider: 'bridge',
  source: {
    currency: 'usd',
    amount: 10000,
  },
  destination: {
    currency: 'usdc',
    customer: { id: 'cus_abc123' },
    payment_method: {
      type: 'customer_wallet',
      chain: 'polygon',
      evm_address: '0x1234567890abcdef1234567890abcdef12345678',
    },
  },
});

if (result.ok) {
  console.log('Buy ID:', result.value.data.id);
  console.log('Status:', result.value.data.status);
}
```

### Buy request fields

| Field | Type | Description |
|---|---|---|
| `provider` | `"bridge"` | Currently only Bridge is supported |
| `source.currency` | `"usd"` | Source fiat currency |
| `source.amount` | `number` | Amount in smallest unit (optional) |
| `destination.currency` | `"usdc" \| "usdt" \| "usdb"` | Target stablecoin |
| `destination.customer.id` | `string` | Customer UUID |
| `destination.payment_method.type` | `"customer_wallet"` | Must be a crypto wallet |
| `destination.payment_method.chain` | `string` | Target chain (`ethereum`, `polygon`, `arbitrum`, `solana`) |
| `destination.payment_method.evm_address` | `string` | Destination wallet address |

### Buy response

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Transaction ID |
| `status` | `string` | Status (e.g., `"captured"`) |
| `type` | `"buy"` | Always `"buy"` |
| `provider` | `"bridge" \| "brla"` | Provider used |
| `source` | `object` | Source currency and amount |
| `destination` | `object` | Destination currency, customer, and wallet |
| `provider_response` | `object` | Raw provider response |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |

---

## Sell (off-ramp)

Convert crypto to fiat via Avenia.

### Methods

| Method | Description |
|---|---|
| `create(request)` | Create a sell transaction |

### Create a sell

```typescript
const result = await sell.create({
  provider: 'avenia',
  source: {
    customer: { id: 'cus_abc123' },
    currency: 'brla',
    amount: 5000,
  },
  destination: {
    customer: { id: 'cus_def456' },
    currency: 'brl',
    payment_method: {
      type: 'pix',
      id: 'pm_pix_xyz',
    },
  },
});

if (result.ok) {
  console.log('Sell ID:', result.value.data.id);
  console.log('Status:', result.value.data.status);
}
```

### Sell request fields

| Field | Type | Description |
|---|---|---|
| `provider` | `"avenia"` | Currently only Avenia is supported |
| `source.customer.id` | `string` | Source customer UUID (optional — defaults to master account) |
| `source.currency` | `string` | Source currency (e.g., `"brla"`) |
| `source.amount` | `number` | Amount to sell |
| `destination.customer.id` | `string` | Destination customer UUID |
| `destination.currency` | `string` | Target fiat currency (e.g., `"brl"`) |
| `destination.payment_method` | `object` | PIX payment method — either `{ type: "pix", id }` or `{ type: "pix", pix_string }` |

### Sell response

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Transaction ID |
| `status` | `string` | Status (e.g., `"created"`) |
| `type` | `"sell"` | Always `"sell"` |
| `provider` | `string` | Provider used |
| `source` | `object` | Source amount and currency |
| `destination` | `object` | Destination currency, customer, and payment method |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |
