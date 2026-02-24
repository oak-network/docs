# Webhooks

The `WebhookService` lets you register endpoints to receive real-time notifications when events occur — payments, refunds, transfers, and more.

```typescript
import { createOakClient, createWebhookService } from '@oaknetwork/api';

const client = createOakClient({ ... });
const webhooks = createWebhookService(client);
```

## Methods

| Method | Endpoint | Description |
|---|---|---|
| `register(webhook)` | `POST /api/v1/merchant/webhooks` | Register a new webhook |
| `list()` | `GET /api/v1/merchant/webhooks` | List all registered webhooks |
| `get(id)` | `GET /api/v1/merchant/webhooks/{id}` | Get a webhook by ID |
| `update(id, webhook)` | `PUT /api/v1/merchant/webhooks/{id}` | Update a webhook |
| `toggle(id)` | `PATCH /api/v1/merchant/webhooks/{id}/toggle` | Toggle a webhook on or off |
| `delete(id)` | `DELETE /api/v1/merchant/webhooks/{id}` | Delete a webhook |
| `listNotifications(params?)` | `GET /api/v1/merchant/webhooks/notifications` | List webhook notifications |
| `getNotification(id)` | `GET /api/v1/merchant/webhooks/notifications/{id}` | Get a specific notification |

## Register a webhook

```typescript
const result = await webhooks.register({
  url: 'https://your-server.com/webhooks/oak',
  description: 'Production webhook',
});

if (result.ok) {
  const webhook = result.value.data;
  console.log('Webhook ID:', webhook.id);
  console.log('Secret:', webhook.secret); // store this — used to verify signatures
}
```

> The `secret` is only returned on `register`. Store it securely — you need it to verify incoming webhook signatures.

## List webhooks

```typescript
const result = await webhooks.list();

if (result.ok) {
  for (const wh of result.value.data) {
    console.log(`${wh.id} — ${wh.url} — active: ${wh.is_active}`);
  }
}
```

## Update a webhook

```typescript
const result = await webhooks.update('wh_abc123', {
  url: 'https://your-server.com/webhooks/oak-v2',
  description: 'Updated endpoint',
});
```

## Toggle a webhook

Enable or disable a webhook without deleting it:

```typescript
const result = await webhooks.toggle('wh_abc123');

if (result.ok) {
  console.log('Active:', result.value.data.is_active);
}
```

## Delete a webhook

```typescript
const result = await webhooks.delete('wh_abc123');

if (result.ok) {
  console.log('Deleted:', result.value.data.success);
}
```

## Notifications

List all notifications that have been sent to your webhooks:

```typescript
const result = await webhooks.listNotifications({
  limit: 20,
  offset: 0,
});

if (result.ok) {
  console.log(`Total notifications: ${result.value.data.count}`);
  for (const n of result.value.data.notification_list) {
    console.log(`  ${n.id} — event: ${n.event} — ack: ${n.is_acknowledged}`);
  }
}
```

Get a specific notification:

```typescript
const result = await webhooks.getNotification('notif_abc123');

if (result.ok) {
  console.log('Event:', result.value.data.event);
  console.log('Category:', result.value.data.category);
  console.log('Payload:', result.value.data.data);
}
```

## Webhook data types

### RegisterRequest

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | The URL to receive webhook events |
| `description` | `string` | No | Human-readable description |

### Webhook data (response)

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Webhook ID |
| `url` | `string` | Registered URL |
| `description` | `string` | Description |
| `secret` | `string` | Signing secret (only on `register`) |
| `is_active` | `boolean` | Whether the webhook is active |

### Notification

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Notification ID |
| `event` | `string \| null` | Event type |
| `category` | `string \| null` | Event category |
| `data` | `any` | Event payload |
| `is_acknowledged` | `boolean` | Whether the notification was acknowledged |
