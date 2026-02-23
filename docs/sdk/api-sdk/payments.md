# Payments

The `PaymentService` handles creating, confirming, and cancelling payments across multiple payment providers.

```typescript
const cs = Crowdsplit(client);
const payments = cs.payments;
```

> Or create the service directly: `const payments = createPaymentService(client)`.

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `create(payment)` | `POST /api/v1/payments/` | Create a new payment |
| `confirm(paymentId)` | `POST /api/v1/payments/{id}/confirm` | Confirm a pending payment |
| `cancel(paymentId)` | `POST /api/v1/payments/{id}/cancel` | Cancel a pending payment |

## Create a payment

Payment requests are provider-specific. Pass the `provider` field to select the request shape.

### Stripe

```typescript
const result = await payments.create({
  provider: 'stripe',
  source: {
    amount: 5000,
    currency: 'usd',
    customer: { id: 'cus_abc123' },
    payment_method: { type: 'card', id: 'pm_xyz789' },
    capture_method: 'automatic',
  },
  confirm: true,
});

if (result.ok) {
  console.log('Payment ID:', result.value.data.id);
  console.log('Status:', result.value.data.status);
}
```

### PagarMe

```typescript
const result = await payments.create({
  provider: 'pagar_me',
  source: {
    amount: 10000,
    currency: 'BRL',
    customer: { id: 'cus_abc123' },
    payment_method: {
      type: 'card',
      card_token: 'tok_xyz',
      billing_address: {
        house_number: '100',
        street_number: '1',
        street_name: 'Rua Example',
        postal_code: '01001000',
        city: 'Sao Paulo',
        state: 'SP',
        country_code: 'BR',
      },
    },
    capture_method: 'automatic',
    fraud_check: {
      enabled: true,
      provider: 'konduto',
      config: { sequence: 'fraud_before_auth', threshold: 'medium' },
      data: {
        last_four_digits: '4242',
        card_expiration_date: '12/2027',
        card_holder_name: 'Alice Smith',
      },
    },
  },
  confirm: true,
});
```

### MercadoPago

```typescript
const result = await payments.create({
  provider: 'mercado_pago',
  source: {
    amount: 25000,
    currency: 'COP',
    customer: { id: 'cus_abc123' },
    payment_method: { type: 'card', card_token: 'tok_xyz' },
    capture_method: 'automatic',
  },
  confirm: true,
});
```

## Provider request fields

| Field | Stripe | PagarMe | MercadoPago |
|---|---|---|---|
| `provider` | `"stripe"` | `"pagar_me"` | `"mercado_pago"` |
| `source.currency` | Any string | `"BRL"` | `"COP"` |
| `source.payment_method.id` | Card PM ID | Card PM ID or omit | — |
| `source.payment_method.card_token` | — | Required if no `id` | Required |
| `source.fraud_check` | Optional (disabled) | Required | — |
| `destination` | Optional (connected accounts) | — | — |
| `flow` | `"platform"` or `"destination"` | — | — |
| `allocations` | Optional split payments | — | — |

## Confirm a payment

```typescript
const result = await payments.confirm('pay_abc123');

if (result.ok) {
  console.log('Confirmed. Status:', result.value.data.status);
}
```

## Cancel a payment

```typescript
const result = await payments.cancel('pay_abc123');

if (result.ok) {
  console.log('Cancelled. Status:', result.value.data.status);
}
```

## Response type

All three methods return `Result<Payment.Response>`. The response data extends the original request with additional fields:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Payment ID |
| `status` | `string` | Payment status (e.g., `"created"`, `"confirmed"`, `"cancelled"`) |
| `type` | `"payment"` | Always `"payment"` |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |
| `provider_response` | `object` | Raw provider response data |

> To issue a refund on a completed payment, see [Refunds](/docs/sdk/api-sdk/refunds).
