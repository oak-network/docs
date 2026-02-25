# Customers

A customer represents an end user or business entity in your platform. Every payment, payment method, and provider registration is tied to a customer. Create a customer first, then attach payment methods and initiate payments on their behalf.

```typescript
import { createOakClient, createCustomerService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const customers = createCustomerService(client);
```

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `create(customer)` | `POST /api/v1/customers` | Create a new customer |
| `get(id)` | `GET /api/v1/customers/{id}` | Get a customer by ID |
| `list(params?)` | `GET /api/v1/customers` | List customers with optional filters |
| `update(id, customer)` | `PUT /api/v1/customers/{id}` | Update an existing customer |

## Create a customer

```typescript
const result = await customers.create({
  email: 'alice@example.com',
  first_name: 'Alice',
  last_name: 'Smith',
  country_code: 'US',
});

if (result.ok) {
  console.log('Customer ID:', result.value.data.id);
}
```

## Get a customer

```typescript
const result = await customers.get('cus_abc123');

if (result.ok) {
  console.log('Email:', result.value.data.email);
}
```

## List customers

```typescript
const result = await customers.list({
  limit: 10,
  offset: 0,
  email: 'alice@example.com',
});

if (result.ok) {
  console.log(`Total: ${result.value.data.count}`);
  for (const c of result.value.data.customer_list) {
    console.log(`  ${c.id} — ${c.email}`);
  }
}
```

### Query parameters

| Parameter | Type | Description |
|---|---|---|
| `limit` | `number` | Maximum number of results |
| `offset` | `number` | Number of results to skip |
| `email` | `string` | Filter by email address |
| `country_code` | `string` | Filter by country code |
| `document_type` | `string` | Filter by document type |
| `provider` | `string` | Filter by provider |
| `provider_registration_status` | `string` | Filter by provider registration status |
| `target_role` | `string` | Filter by target role |

## Update a customer

```typescript
const result = await customers.update('cus_abc123', {
  first_name: 'Alice',
  last_name: 'Johnson',
  phone_country_code: '1',
  phone_area_code: '415',
  phone_number: '5551234',
});

if (result.ok) {
  console.log('Updated:', result.value.data.last_name);
}
```

## Request fields

All fields except `email` are optional on create. On update, all fields are optional.

| Field | Type | Description |
|---|---|---|
| `email` | `string` | Customer email address |
| `first_name` | `string` | First name |
| `last_name` | `string` | Last name |
| `document_number` | `string` | Tax ID or document number |
| `document_type` | `"personal_tax_id" \| "company_tax_id"` | Document type |
| `dob` | `string` | Date of birth |
| `phone_country_code` | `string` | Phone country code |
| `phone_area_code` | `string` | Phone area code |
| `phone_number` | `string` | Phone number |
| `country_code` | `string` | Country code |
| `company_name` | `string` | Company name |

## Response data

The response `data` object includes all request fields plus additional system fields like `id`, `customer_id`, `customer_wallet`, `trading_wallet`, `account_type`, and address fields.
