# Disputes

A dispute (chargeback) occurs when a customer contests a payment with their bank or card issuer. Use the dispute service to list disputes, submit evidence, and manage dispute resolution. Evidence can include files (documents, screenshots) or text (descriptions, explanations).

```typescript
import { createOakClient, createDisputeService } from '@oaknetwork/payments-sdk';

const client = createOakClient({ ... });
const disputes = createDisputeService(client);
```

## Methods

| Method | Description |
|---|---|
| `list(query?)` | List disputes with optional filters |
| `updateEvidence(disputeId, evidence)` | Add or update evidence for a dispute |
| `submit(disputeId)` | Submit a dispute for review |
| `close(disputeId)` | Close a dispute (accept the chargeback) |

## List disputes

```typescript
const result = await disputes.list({
  limit: 20,
  offset: 0,
});

if (result.ok) {
  for (const dispute of result.value.data) {
    console.log(`${dispute.id} — ${dispute.status} — ${dispute.amount}`);
  }
}
```

## Update evidence

Add evidence to support your case. Evidence can be files or text:

### File evidence

```typescript
const result = await disputes.updateEvidence('dsp_abc123', {
  type: 'file',
  file_id: 'file_xyz789',
  category: 'receipt',
  description: 'Original purchase receipt',
});

if (result.ok) {
  console.log('Evidence added');
}
```

### Text evidence

```typescript
const result = await disputes.updateEvidence('dsp_abc123', {
  type: 'text',
  category: 'customer_communication',
  content: 'Customer confirmed receipt of goods via email on 2026-04-15.',
});

if (result.ok) {
  console.log('Evidence added');
}
```

### Evidence request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `"file" \| "text"` | Yes | Evidence type |
| `file_id` | `string` | File only | ID of an uploaded file |
| `category` | `string` | Yes | Evidence category (e.g., `"receipt"`, `"customer_communication"`) |
| `description` | `string` | No | Description of the evidence |
| `content` | `string` | Text only | Text content of the evidence |

## Submit a dispute

After adding all evidence, submit the dispute for review:

```typescript
const result = await disputes.submit('dsp_abc123');

if (result.ok) {
  console.log('Dispute submitted for review');
}
```

## Close a dispute

Accept the chargeback and close the dispute:

```typescript
const result = await disputes.close('dsp_abc123');

if (result.ok) {
  console.log('Dispute closed');
}
```

## Response data

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Dispute ID |
| `payment_id` | `string` | Associated payment ID |
| `status` | `string` | Dispute status |
| `amount` | `number` | Disputed amount |
| `reason` | `string` | Dispute reason |
| `evidence` | `array` | Submitted evidence items |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |
