# Providers

Before a customer can send or receive payments through a specific provider, they must be registered with that provider. The provider service handles this onboarding — fetch the required fields for a given provider, submit a registration, and check its approval status. Each provider (Stripe, PagarMe, MercadoPago, Bridge, Avenia) has its own registration schema and approval flow.

```typescript
import { createOakClient, createProviderService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const providers = createProviderService(client);
```

## Supported providers

| Provider | Value | Description |
|---|---|---|
| Stripe | `"stripe"` | Card payments, transfers, connected accounts |
| PagarMe | `"pagar_me"` | Card payments and transfers (Brazil) |
| MercadoPago | `"mercado_pago"` | Card payments (Colombia) |
| Bridge | `"bridge"` | Crypto on-ramp, bank accounts, Plaid |
| Avenia | `"avenia"` | Crypto off-ramp, PIX (Brazil) |

## Methods

| Method | Description |
|---|---|
| `getSchema(request)` | Get the registration schema for a provider |
| `getRegistrationStatus(customerId)` | Check registration status for a customer |
| `submitRegistration(customerId, request)` | Submit a provider registration |

## Get a provider schema

Retrieve the registration schema for a provider. The response describes the available roles and the fields required for each:

```typescript
const result = await providers.getSchema({ provider: 'stripe' });

if (result.ok) {
  const { schema } = result.value.data;
  console.log('Provider:', schema.provider);
  console.log('Allowed roles:', schema.allowed_roles);

  for (const [role, config] of Object.entries(schema.roles)) {
    console.log(`\nRole: ${role}`);
    console.log('  Required fields:', config.required_fields);
    console.log('  Provider data required:', config.provider_data_required);
    if (Object.keys(config.provider_data_schema).length > 0) {
      console.log('  Provider data fields:', Object.keys(config.provider_data_schema));
    }
  }

  console.log('\nGlobal required fields:', Object.keys(schema.global_required_fields));
}
```

### Schema response structure

| Field | Type | Description |
|---|---|---|
| `schema.provider` | `string` | Provider name |
| `schema.allowed_roles` | `string[]` | Roles the provider supports (e.g., `["customer", "connected_account"]`) |
| `schema.roles` | `object` | Per-role configuration (see below) |
| `schema.global_required_fields` | `object` | Fields required across all roles (e.g., `email`, `country_code`) |

Each role in `schema.roles` contains:

| Field | Type | Description |
|---|---|---|
| `required_fields` | `string[]` | Fields required for this role |
| `provider_data_schema` | `object` | Field definitions for `provider_data` |
| `provider_data_required` | `boolean` | Whether `provider_data` must be supplied |

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

> For Stripe `connected_account`, the customer must have a `country_code` set. Create or update the customer with `country_code` before registering.

### Stripe connected account

```typescript
const result = await providers.submitRegistration(customerId, {
  provider: 'stripe',
  target_role: 'connected_account',
  provider_data: {
    account_type: 'express',
    transfers_requested: true,
    card_payments_requested: true,
    tax_reporting_us_1099_k_requested: false,
    payouts_debit_negative_balances: false,
    external_account_collection_requested: false,
  },
});

if (result.ok) {
  console.log('Status:', result.value.data.status);
  console.log('Provider:', result.value.data.provider);
  console.log('Role:', result.value.data.target_role);
}
```

### Stripe customer

```typescript
const result = await providers.submitRegistration(customerId, {
  provider: 'stripe',
  target_role: 'customer',
});

if (result.ok) {
  console.log('Status:', result.value.data.status);
}
```

### Bridge customer

```typescript
const result = await providers.submitRegistration(customerId, {
  provider: 'bridge',
  target_role: 'customer',
});
```

### Registration request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | `Provider.Name` | Yes | Provider to register with |
| `target_role` | `"subaccount" \| "customer" \| "connected_account"` | Yes | Role for the registration |
| `provider_data` | `object` | No | Provider-specific registration data (required for `connected_account`) |

### Registration response

| Field | Type | Description |
|---|---|---|
| `status` | `string` | Registration status (e.g., `"awaiting_confirmation"`, `"submitted"`) |
| `provider` | `string` | Provider name |
| `target_role` | `string` | Role the customer was registered as |
| `provider_data` | `object` | Submitted provider data (if any) |
| `provider_response` | `object` | Raw provider response (e.g., Stripe keys, Bridge KYC/TOS URLs) |
| `readiness` | `object` | Capability readiness per payment type |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |

### Provider data fields (Stripe connected account)

| Field | Type | Required | Description |
|---|---|---|---|
| `account_type` | `string` | Yes | Account type (`"standard"`, `"express"`, `"custom"`) |
| `transfers_requested` | `boolean` | Yes | Request transfer capability |
| `card_payments_requested` | `boolean` | Yes | Request card payment capability |
| `tax_reporting_us_1099_k_requested` | `boolean` | Yes | Request US tax reporting |
| `payouts_debit_negative_balances` | `boolean` | Yes | Allow debit on negative balances |
| `external_account_collection_requested` | `boolean` | Yes | Request external account collection |
| `callback_url` | `string` | No | OAuth callback URL |
