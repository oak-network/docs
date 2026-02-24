# Payment Methods

The `PaymentMethodService` manages payment methods attached to customers — cards, bank accounts, crypto wallets, PIX, and more.

```typescript
import { createOakClient, createPaymentMethodService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const paymentMethods = createPaymentMethodService(client);
```

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `add(customerId, method)` | `POST /api/v1/customers/{customerId}/payment_methods` | Add a payment method to a customer |
| `get(customerId, paymentId)` | `GET /api/v1/customers/{customerId}/payment_methods/{paymentId}` | Get a specific payment method |
| `list(customerId, query?)` | `GET /api/v1/customers/{customerId}/payment_methods` | List a customer's payment methods |
| `delete(customerId, methodId)` | `DELETE /api/v1/customers/{customerId}/payment_methods/{methodId}` | Delete a payment method |

## Add a payment method

The request shape depends on the payment method type and provider. Here are the most common patterns.

### Stripe card

```typescript
const result = await paymentMethods.add('cus_abc123', {
  type: 'card',
  provider: 'stripe',
});
```

### Bridge bank account

```typescript
const result = await paymentMethods.add('cus_abc123', {
  type: 'bank',
  provider: 'bridge',
  currency: 'usd',
  bank_name: 'Chase',
  bank_account_number: '000123456789',
  bank_routing_number: '021000021',
  bank_account_type: 'checking',
  bank_account_name: 'Alice Smith',
  billing_address: {
    street_line_1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    country: 'US',
  },
});
```

### Crypto wallet

```typescript
const result = await paymentMethods.add('cus_abc123', {
  type: 'customer_wallet',
  evm_address: '0x1234567890abcdef1234567890abcdef12345678',
  chain: 'polygon',
  currency: 'usdc',
});
```

### PIX

```typescript
const result = await paymentMethods.add('cus_abc123', {
  type: 'pix',
  pix_string: 'alice@example.com',
});
```

## Payment method types

| Type | Providers | Description |
|---|---|---|
| `BridgeBankAccount` | Bridge | US bank account with routing/account numbers |
| `OakBankAccount` | Oak | Bank account with SWIFT code |
| `StripeBankAccount` | Stripe | Bank account via Stripe |
| `MercadoPagoCard` | MercadoPago | Card via token |
| `PagarMeCard` | PagarMe | Card via token with billing address |
| `StripeCard` | Stripe | Card via Stripe |
| `OakCustomerWallet` | Oak | EVM wallet address |
| `BridgeLiquidationAddress` | Bridge | Crypto liquidation address |
| `OakPix` | Oak | PIX payment method |
| `BridgePlaid` | Bridge | Plaid-linked bank account |
| `BridgeVirtualAccount` | Bridge | Virtual account for on/off ramp |

## List payment methods

```typescript
const result = await paymentMethods.list('cus_abc123', {
  type: 'card',
});

if (result.ok) {
  for (const pm of result.value.data) {
    console.log(`${pm.id} — ${pm.type} — ${pm.status}`);
  }
}
```

## Get a payment method

```typescript
const result = await paymentMethods.get('cus_abc123', 'pm_xyz789');

if (result.ok) {
  console.log('Type:', result.value.data.type);
  console.log('Status:', result.value.data.status);
}
```

## Delete a payment method

```typescript
const result = await paymentMethods.delete('cus_abc123', 'pm_xyz789');

if (result.ok) {
  console.log('Deleted');
}
```
