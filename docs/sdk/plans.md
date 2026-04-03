# Plans

A plan defines a recurring billing configuration — price, currency, billing frequency, and renewal behavior. Plans start as drafts, giving you time to configure them before publishing. Once published, customers can subscribe to a plan and be billed automatically at the defined interval.

```typescript
import { createOakClient, createPlanService } from '@oaknetwork/payments-sdk';

const client = createOakClient({ ... });
const plans = createPlanService(client);
```

## Methods

| Method | Description |
|---|---|
| `create(plan)` | Create a new plan |
| `publish(id)` | Publish a draft plan |
| `details(id)` | Get plan details |
| `list(params?)` | List plans with pagination |
| `update(id, plan)` | Update a plan |
| `delete(id)` | Delete a plan |

## Create a plan

```typescript
const result = await plans.create({
  name: 'Pro Monthly',
  description: 'Full access to all features',
  frequency: 30,
  price: 2999,
  currency: 'USD',
  start_date: '2026-03-01',
  is_auto_renewable: true,
  allow_amount_override: false,
  created_by: 'admin_001',
});

if (result.ok) {
  console.log('Plan created:', result.value.data);
}
```

## Publish a plan

Plans start as drafts. Publish them to make them available:

```typescript
const result = await plans.publish('plan_abc123');

if (result.ok) {
  console.log('Plan published');
}
```

## Get plan details

```typescript
const result = await plans.details('plan_abc123');

if (result.ok) {
  const plan = result.value.data;
  console.log(`${plan.name} — ${plan.price} ${plan.currency}`);
  console.log(`Active: ${plan.is_active}`);
  console.log(`Auto-renew: ${plan.is_auto_renewable}`);
}
```

## List plans

```typescript
const result = await plans.list({
  page_no: 1,
  per_page: 10,
});

if (result.ok) {
  const { data, pagination } = result.value.data;
  console.log(`Page ${pagination.page_no} of ${Math.ceil(pagination.total / pagination.per_page)}`);
  for (const plan of data) {
    console.log(`  ${plan.hash_id} — ${plan.name}`);
  }
}
```

## Update a plan

```typescript
const result = await plans.update('plan_abc123', {
  name: 'Pro Monthly (Updated)',
  description: 'Updated description',
  frequency: 30,
  price: 3499,
  currency: 'USD',
  start_date: '2026-03-01',
  is_auto_renewable: true,
  allow_amount_override: false,
  created_by: 'admin_001',
});
```

## Delete a plan

```typescript
const result = await plans.delete('plan_abc123');

if (result.ok) {
  console.log('Plan deleted');
}
```

## Plan request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Plan name |
| `description` | `string` | Yes | Plan description |
| `frequency` | `number` | Yes | Billing frequency in days |
| `price` | `number` | Yes | Price in smallest currency unit |
| `currency` | `string` | Yes | Currency code (e.g., `"USD"`) |
| `start_date` | `string` | Yes | Start date in `YYYY-MM-DD` format |
| `end_date` | `string` | No | Optional end date |
| `is_auto_renewable` | `boolean` | Yes | Whether the plan auto-renews |
| `allow_amount_override` | `boolean` | Yes | Whether subscribers can override the amount |
| `created_by` | `string` | Yes | Creator identifier |

## Plan details (response)

| Field | Type | Description |
|---|---|---|
| `hash_id` | `string` | Plan ID |
| `name` | `string` | Plan name |
| `description` | `string` | Plan description |
| `frequency` | `number` | Billing frequency in days |
| `price` | `number` | Price |
| `is_active` | `boolean` | Whether the plan is active |
| `is_auto_renewable` | `boolean` | Whether it auto-renews |
| `currency` | `string` | Currency code |
| `start_time` | `string` | ISO datetime |
| `end_time` | `string` | ISO datetime |
| `created_at` | `string` | ISO datetime |
| `updated_at` | `string` | ISO datetime |
