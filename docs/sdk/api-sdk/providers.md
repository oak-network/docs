# Providers

The `ProviderService` manages payment provider registration — retrieve provider schemas, check registration status, and submit registrations.

```typescript
const cs = Crowdsplit(client);
const providers = cs.providers;
```

> Or create the service directly: `const providers = createProviderService(client)`.

## Supported providers

| Provider | Value | Description |
|---|---|---|
| Stripe | `"stripe"` | Card payments, transfers, connected accounts |
| PagarMe | `"pagar_me"` | Card payments and transfers (Brazil) |
| MercadoPago | `"mercado_pago"` | Card payments (Colombia) |
| Bridge | `"bridge"` | Crypto on-ramp, bank accounts, Plaid |
| Avenia | `"avenia"` | Crypto off-ramp, PIX (Brazil) |

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `getSchema(request)` | `GET /api/v1/provider-registration/schema?provider={name}` | Get the registration schema for a provider |
| `getRegistrationStatus(customerId)` | `GET /api/v1/provider-registration/{customerId}/status` | Check registration status for a customer |
| `submitRegistration(customerId, request)` | `POST /api/v1/provider-registration/{customerId}/submit` | Submit a provider registration |

## Get a provider schema

Retrieve the JSON schema that defines what fields are required to register a customer with a provider:

```typescript
const result = await providers.getSchema({ provider: 'stripe' });

if (result.ok) {
  const schema = result.value.data;
  console.log('Required fields:', schema.required);
  console.log('Properties:', Object.keys(schema.properties));
}
```

## Check registration status

```typescript
const result = await providers.getRegistrationStatus('cus_abc123');

if (result.ok) {
  for (const reg of result.value.data) {
    console.log(`${reg.provider} — status: ${reg.status} — role: ${reg.target_role}`);
  }
}
```

### Registration status fields

| Field | Type | Description |
|---|---|---|
| `provider` | `string` | Provider name |
| `status` | `string` | Registration status (e.g., `"created"`, `"approved"`) |
| `target_role` | `string \| null` | Role the customer is registered as |
| `provider_response` | `any` | Raw provider response |
| `rejection_reason` | `string \| null` | Reason for rejection, if applicable |
| `readiness` | `any` | Provider readiness data |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |

## Submit a registration

```typescript
const result = await providers.submitRegistration('cus_abc123', {
  provider: 'stripe',
  target_role: 'connected_account',
  provider_data: {
    account_type: 'express',
    transfers_requested: true,
    card_payments_requested: true,
  },
});

if (result.ok) {
  for (const reg of result.value.data) {
    console.log(`Status: ${reg.status}`);
  }
}
```

### Registration request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | `Provider.Name` | Yes | Provider to register with |
| `target_role` | `"subaccount" \| "customer" \| "connected_account"` | Yes | Role for the registration |
| `provider_data` | `object` | No | Provider-specific registration data |

### Provider data fields (Stripe example)

| Field | Type | Description |
|---|---|---|
| `callback_url` | `string` | OAuth callback URL |
| `account_type` | `string` | Account type (e.g., `"express"`) |
| `transfers_requested` | `boolean` | Request transfer capability |
| `card_payments_requested` | `boolean` | Request card payment capability |
| `tax_reporting_us_1099_k_requested` | `boolean` | Request US tax reporting |
| `payouts_debit_negative_balances` | `boolean` | Allow debit on negative balances |
| `external_account_collection_requested` | `boolean` | Request external account collection |
