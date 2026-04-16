# Integration Flow

Detailed provider-specific integration flows, all operations, and advanced features of the Payment SDK.

import MermaidDiagram from '@site/src/components/MermaidDiagram';

---

## US Integration Flow (Stripe + Bridge)

Complete flow for US-based platforms with USD payments and optional USDC conversion.

<MermaidDiagram title="US Flow - Complete Sequence">

```mermaid
sequenceDiagram
    participant Platform
    participant Oak as Oak Network API
    participant Stripe
    participant Bridge
    participant Backer
    participant Creator
    
    rect rgb(40, 40, 60)
    Note over Platform,Bridge: Phase 1: Setup & KYC
    Platform->>Oak: POST /merchant/token/grant
    Oak-->>Platform: access_token
    
    Platform->>Oak: POST /customers (creator)
    Oak-->>Platform: creator.customer_id
    
    Platform->>Oak: POST /provider-registration/:id/submit (stripe, connected_account)
    Oak-->>Platform: client_secret for Stripe onboarding
    Creator->>Stripe: Complete KYC via Stripe UI
    Stripe-->>Oak: Webhook: KYC approved
    
    Platform->>Oak: POST /provider-registration/:id/submit (bridge, customer)
    Oak-->>Platform: kyc_url, tos_url
    Creator->>Bridge: Complete Bridge KYC
    Bridge-->>Oak: Webhook: KYC approved
    
    Platform->>Oak: POST /customers (backer)
    Oak-->>Platform: backer.customer_id
    Platform->>Oak: POST /provider-registration/:id/submit (stripe, customer)
    Oak-->>Platform: Backer registered
    end
    
    rect rgb(40, 60, 40)
    Note over Platform,Bridge: Phase 2: Payment
    Platform->>Oak: POST /payments
    Oak->>Stripe: Create PaymentIntent
    Stripe-->>Oak: client_secret
    Oak-->>Platform: payment_id, client_secret
    
    Backer->>Stripe: Enter card details
    Stripe-->>Oak: Webhook: payment.captured
    Oak-->>Platform: Webhook: payment.captured
    end
    
    rect rgb(60, 60, 40)
    Note over Platform,Bridge: Phase 3: Virtual Account Setup (One-time)
    Platform->>Oak: POST /customers/:id/payment_methods (virtual_account)
    Oak->>Bridge: Create virtual account
    Bridge-->>Oak: bank_account_number, routing_number
    Oak-->>Platform: Virtual account details
    
    Platform->>Oak: POST /customers/:id/payment_methods (bank to Stripe)
    Oak->>Stripe: Add external account
    Stripe-->>Oak: External account linked
    Note over Stripe,Bridge: Stripe payouts now go to Bridge virtual account
    end
    
    rect rgb(60, 40, 40)
    Note over Platform,Bridge: Phase 4: Crypto Off-Ramp (Optional)
    Platform->>Oak: POST /customers/:id/payment_methods (bank to Bridge)
    Oak->>Bridge: Add real bank account
    Bridge-->>Oak: External account added
    
    Platform->>Oak: POST /customers/:id/payment_methods (liquidation_address)
    Oak->>Bridge: Create liquidation address
    Bridge-->>Oak: liquidation_address (0x...)
    Oak-->>Platform: Liquidation address
    
    Note over Platform,Bridge: Creator sends USDC to liquidation address
    Bridge-->>Creator: USD deposited to bank
    end
```

</MermaidDiagram>

### Phase 1: Authentication & Customer Setup

```typescript
import { 
  createOakClient, 
  createCustomerService, 
  createProviderService 
} from '@oaknetwork/payments-sdk';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);
const providers = createProviderService(client);

// Register campaign creator
const creator = await customers.create({
  email: 'creator@example.com',
  country_code: 'US',
});

// Register creator with Stripe as connected account
const stripeReg = await providers.submitRegistration(creator.value.data.customer_id, {
  provider: 'stripe',
  target_role: 'connected_account',
  provider_data: {
    account_type: 'custom',
    transfers_requested: true,
    card_payments_requested: true,
    tax_reporting_us_1099_k_requested: true,
    payouts_debit_negative_balances: true,
  },
});

// Use client_secret to load Stripe Connect onboarding UI
const { client_secret, publishable_key } = stripeReg.value.data.provider_response;

// Register creator with Bridge for crypto
const bridgeReg = await providers.submitRegistration(creator.value.data.customer_id, {
  provider: 'bridge',
  target_role: 'customer',
  provider_data: {
    callback_url: 'https://yourplatform.com/kyc-complete',
  },
});

// Redirect to Bridge KYC
const { kyc_url, tos_url } = bridgeReg.value.data.provider_response;
```

### Phase 2: Payment Collection

```typescript
import { createPaymentService } from '@oaknetwork/payments-sdk';

const payments = createPaymentService(client);

const payment = await payments.create({
  provider: 'stripe',
  source: {
    amount: 10000, // $100.00 in cents
    customer: { id: backerCustomerId },
    currency: 'usd',
    payment_method: { type: 'card' },
    capture_method: 'automatic',
  },
  destination: {
    currency: 'usd',
    customer: { id: creatorCustomerId },
  },
  confirm: true,
  metadata: {
    campaign_id: 'campaign_12345',
    reward_tier: 'early_bird',
  },
});

if (payment.ok) {
  // Use client_secret to load Stripe payment UI
  const { client_secret } = payment.value.data.provider_response;
}
```

### Phase 3: Virtual Account for Auto-Conversion

```typescript
import { createPaymentMethodService } from '@oaknetwork/payments-sdk';

const paymentMethods = createPaymentMethodService(client);

// Create Bridge virtual account (receives USD, converts to USDC)
const virtualAccount = await paymentMethods.add(creatorCustomerId, {
  type: 'virtual_account',
  provider: 'bridge',
  source_currency: 'usd',
  destination_currency: 'usdc',
  provider_data: {
    chain: 'ethereum',
    evm_address: creatorWalletAddress,
  },
});

const { bank_account_number, bank_routing_number } = 
  virtualAccount.value.data.provider_response.source_deposit_instructions;

// Link virtual account to Stripe as external account
const stripeExternal = await paymentMethods.add(creatorCustomerId, {
  type: 'bank',
  provider: 'stripe',
  bank_name: 'Bridge Virtual Bank',
  bank_account_number,
  bank_routing_number,
  bank_account_type: 'CHECKING',
  bank_account_name: 'Creator Business',
  currency: 'usd',
  bank_metadata: {
    virtual_account_id: virtualAccount.value.data.id,
  },
});
```

### Phase 4: Off-Ramp (USDC to Bank)

```typescript
// Add real bank account to Bridge
const realBank = await paymentMethods.add(creatorCustomerId, {
  type: 'bank',
  provider: 'bridge',
  bank_name: 'Chase',
  bank_account_number: '123456789',
  bank_routing_number: '021000021',
  bank_account_type: 'CHECKING',
  bank_account_name: 'Creator Account',
  currency: 'usd',
});

// Create liquidation address (auto-converts incoming USDC to USD and sends to bank)
const liquidationAddress = await paymentMethods.add(creatorCustomerId, {
  type: 'liquidation_address',
  provider: 'bridge',
  provider_data: {
    chain: 'polygon',
    currency: 'usdc',
    destination_payment_rail: 'ach',
    destination_currency: 'usd',
    destination_payment_method_id: realBank.value.data.id,
  },
});

// Creator sends USDC to this address to automatically receive USD in their bank
const { evm_address } = liquidationAddress.value.data.provider_response;
console.log('Send USDC to:', evm_address);
```

---

## Brazil Integration Flow (PagarMe + Bridge)

Complete flow for Brazil-based platforms with BRL payments and optional BRLA conversion.

<MermaidDiagram title="Brazil Flow - Complete Sequence">

```mermaid
sequenceDiagram
    participant Platform
    participant Oak as Oak Network API
    participant PagarMe
    participant BRLA
    participant Backer
    participant Creator
    
    rect rgb(40, 40, 60)
    Note over Platform,BRLA: Phase 1: Setup & KYC
    Platform->>Oak: POST /customers (creator)
    Oak-->>Platform: creator.customer_id
    
    Platform->>Oak: POST /provider-registration/:id/submit (pagar_me, connected_account)
    Oak-->>Platform: Registration response
    
    Platform->>Oak: POST /customers (backer)
    Oak-->>Platform: backer.customer_id
    end
    
    rect rgb(40, 60, 40)
    Note over Platform,BRLA: Phase 2: Card Payment
    Platform->>Oak: POST /payments (card)
    Oak->>PagarMe: Create charge
    PagarMe-->>Oak: client_secret
    Oak-->>Platform: payment details
    
    Backer->>PagarMe: Enter card details
    PagarMe-->>Oak: Webhook: payment.captured
    end
    
    rect rgb(60, 60, 40)
    Note over Platform,BRLA: Phase 2b: PIX Payment
    Platform->>Oak: POST /payments (pix)
    Oak->>PagarMe: Create PIX charge
    PagarMe-->>Oak: qr_code
    Oak-->>Platform: PIX QR code
    
    Backer->>PagarMe: Scan QR and pay
    PagarMe-->>Oak: Webhook: payment.captured
    end
    
    rect rgb(60, 40, 40)
    Note over Platform,BRLA: Phase 3: Crypto Off-Ramp
    Platform->>Oak: POST /transfers (brla)
    Oak->>BRLA: Transfer BRLA to wallet
    BRLA-->>Creator: BRLA in wallet
    
    Platform->>Oak: POST /sell (bridge)
    Oak->>BRLA: Initiate sell
    BRLA-->>Creator: BRL via PIX
    end
```

</MermaidDiagram>

### Card Payment

```typescript
const payment = await payments.create({
  provider: 'pagar_me',
  source: {
    amount: 10000, // R$100.00 in centavos
    customer: { id: backerCustomerId },
    currency: 'brl',
    payment_method: { type: 'card' },
    capture_method: 'automatic',
  },
  destination: {
    customer: { id: creatorCustomerId },
    currency: 'brl',
  },
  confirm: true,
  metadata: {
    campaign_id: 'campanha_12345',
  },
});
```

### PIX Payment

```typescript
const pixPayment = await payments.create({
  provider: 'pagar_me',
  source: {
    amount: 10000,
    customer: { id: backerCustomerId },
    currency: 'brl',
    payment_method: {
      type: 'pix',
      expiry_date: '2025-12-31T23:59:59Z',
    },
  },
  confirm: true,
});

if (pixPayment.ok) {
  // Display QR code to backer
  // Payment confirmed via webhook when backer pays
}
```

### Transfer BRLA to Wallet

```typescript
import { createTransferService } from '@oaknetwork/payments-sdk';

const transfers = createTransferService(client);

const transfer = await transfers.create({
  provider: 'brla',
  source: {
    customer: { id: creatorCustomerId },
    amount: 10000,
    currency: 'brla',
  },
  destination: {
    customer: { id: creatorCustomerId },
    payment_method: {
      type: 'customer_wallet',
      chain: 'polygon',
      evm_address: '0x1234567890abcdef...',
    },
  },
});
```

### Sell BRLA for BRL (Off-Ramp)

```typescript
import { createSellService, createPaymentMethodService } from '@oaknetwork/payments-sdk';

const paymentMethods = createPaymentMethodService(client);
const sell = createSellService(client);

// Add PIX as payment method
const pixMethod = await paymentMethods.add(creatorCustomerId, {
  type: 'pix',
  pix_string: '12345678901', // CPF, phone, email, or random key
});

// Sell crypto → fiat via PIX
const sellOrder = await sell.create({
  provider: 'bridge',
  source: {
    customer: { id: creatorCustomerId },
    currency: 'brla',
    amount: 10000,
  },
  destination: {
    customer: { id: creatorCustomerId },
    currency: 'brl',
    payment_method: {
      type: 'pix',
      id: pixMethod.value.data.id,
    },
  },
});
```

---

## Buy (On-Ramp) Flow

Convert fiat currency to cryptocurrency.

<MermaidDiagram title="Buy (On-Ramp) Flow">

```mermaid
sequenceDiagram
    participant Platform
    participant Oak as Oak Network API
    participant Bridge
    participant Bank
    participant Blockchain
    
    Platform->>Oak: POST /buy
    Oak->>Bridge: Create on-ramp order
    Bridge-->>Oak: Deposit instructions
    Oak-->>Platform: Bank details + deposit_message
    
    Note over Platform,Bank: Customer deposits USD via ACH/Wire
    Bank->>Bridge: Funds received
    Bridge->>Blockchain: Mint/transfer USDC
    Blockchain-->>Bridge: USDC sent to wallet
    Bridge-->>Oak: Webhook: Buy complete
    Oak-->>Platform: Webhook: Transaction complete
```

</MermaidDiagram>

```typescript
import { createBuyService } from '@oaknetwork/payments-sdk';

const buy = createBuyService(client);

const buyOrder = await buy.create({
  provider: 'bridge',
  source: {
    currency: 'usd',
  },
  destination: {
    currency: 'usdc',
    customer: { id: creatorCustomerId },
    payment_method: {
      type: 'customer_wallet',
      chain: 'polygon',
      evm_address: '0x1234567890abcdef...',
    },
  },
});

if (buyOrder.ok) {
  const { source_deposit_instructions } = buyOrder.value.data.provider_response;
  // Display bank details and deposit_message to customer
  // USDC arrives in wallet when complete
}
```

---

## Subscriptions Flow

Recurring billing with automatic payment collection.

<MermaidDiagram title="Subscriptions Lifecycle">

```mermaid
stateDiagram-v2
    [*] --> Draft: Create Plan
    Draft --> Published: Publish Plan
    Published --> Active: Customer Subscribes
    
    state Active {
        [*] --> Billing
        Billing --> PaymentAttempt: Billing cycle due
        PaymentAttempt --> Success: Payment captured
        PaymentAttempt --> Failed: Payment failed
        Success --> Billing: Wait for next cycle
        Failed --> Retry: Retry with new method
        Retry --> Success
        Retry --> Cancelled: Max retries exceeded
    }
    
    Active --> Cancelled: Cancel Subscription
    Cancelled --> [*]
```

</MermaidDiagram>

```typescript
import { createPlanService } from '@oaknetwork/payments-sdk';

const plans = createPlanService(client);

// 1. Create a plan (draft)
const plan = await plans.create({
  name: 'Premium Monthly',
  description: 'Full access to all features',
  frequency: 30, // Billing frequency in days
  price: 2999,
  currency: 'BRL',
  start_date: '2026-04-01',
  is_auto_renewable: true,
  allow_amount_override: false,
  created_by: 'admin',
});

// 2. Publish the plan (makes it available for subscriptions)
await plans.publish(plan.value.data.hash_id);

// 3. List plans
const allPlans = await plans.list({ page_no: 1, per_page: 10 });

// 4. Get plan details
const planDetails = await plans.details(plan.value.data.hash_id);

// 5. Update a plan
await plans.update(plan.value.data.hash_id, {
  name: 'Premium Monthly (Updated)',
  price: 3499,
  currency: 'BRL',
  frequency: 30,
  start_date: '2026-04-01',
  is_auto_renewable: true,
  allow_amount_override: false,
  created_by: 'admin',
});

// 6. Delete a plan
await plans.delete(plan.value.data.hash_id);
```

---

## Webhook Events Reference

<MermaidDiagram title="Webhook Event Categories">

```mermaid
flowchart LR
    subgraph Registration["Provider Registration"]
        PR1[awaiting_confirmation]
        PR2[approved]
        PR3[rejected]
    end
    
    subgraph Payments["Payment Lifecycle"]
        PY1[awaiting_confirmation]
        PY2[processing]
        PY3[captured]
        PY4[failed]
        PY5[disputed]
        PY6[refunded]
    end
    
    subgraph Subscriptions["Subscription Lifecycle"]
        SB1[activated]
        SB2[renewed]
        SB3[payment_failed]
        SB4[cancelled]
    end
```

</MermaidDiagram>

| Category | Event | When Triggered |
|---|---|---|
| **Provider Registration** | `provider_registration.awaiting_confirmation` | KYC/ToS link generated |
| | `provider_registration.approved` | KYC completed successfully |
| | `provider_registration.rejected` | KYC failed |
| **Payment** | `payment.awaiting_confirmation` | Payment intent created |
| | `payment.captured` | Payment successful |
| | `payment.failed` | Payment failed |
| | `payment.disputed` | Chargeback initiated |
| | `payment.refunded` | Refund issued |
| **Subscription** | `subscription.activated` | Subscription started |
| | `subscription.renewed` | Auto-renewal successful |
| | `subscription.cancelled` | Subscription ended |

---

## Status Reference

### Provider Registration Statuses

| Status | Meaning | Next Steps |
|---|---|---|
| `not_submitted` | Data saved locally | Submit to provider |
| `awaiting_confirmation` | Awaiting user action | User completes KYC/ToS |
| `processing` | Provider reviewing | Wait for decision |
| `approved` | Registration successful | Ready for payments |
| `rejected` | Registration failed | Check rejection reason |

### Payment Statuses

| Status | Meaning | Possible Actions |
|---|---|---|
| `created` | Payment object created | Confirm or cancel |
| `awaiting_confirmation` | Awaiting user action | User completes payment |
| `captured` | Funds captured | Refund if needed |
| `failed` | Payment failed | Retry with different method |
| `refunded` | Fully refunded | No further action |

---

## API Reference

### Service Functions

| Service | Function | Parameters | Description |
|---|---|---|---|
| **CustomerService** | `create(data)` | `email`, `country_code` | Create a new customer |
| | `get(id)` | `customer_id` | Retrieve customer details |
| | `list()` | — | List all customers |
| **ProviderService** | `submitRegistration(id, data)` | `customer_id`, `provider`, `target_role`, `provider_data` | Register customer with payment provider |
| | `getRegistrationStatus(id)` | `customer_id` | Get registration status |
| **PaymentService** | `create(data)` | `provider`, `source`, `destination`, `confirm`, `metadata` | Create payment intent |
| | `confirm(id)` | `payment_id` | Confirm a payment |
| | `cancel(id)` | `payment_id` | Cancel a payment |
| **PaymentMethodService** | `add(id, data)` | `customer_id`, `type`, `provider`, provider-specific fields | Add payment method |
| | `list(id)` | `customer_id` | List customer's payment methods |
| | `delete(id, methodId)` | `customer_id`, `payment_method_id` | Remove payment method |
| **TransferService** | `create(data)` | `provider`, `source`, `destination` | Transfer funds to bank/wallet |
| **BuyService** | `create(data)` | `provider`, `source`, `destination` | Convert fiat to crypto (on-ramp) |
| **SellService** | `create(data)` | `provider`, `source`, `destination` | Convert crypto to fiat (off-ramp) |
| **RefundService** | `create(data)` | `payment_id`, `amount`, `reason` | Refund a captured payment |
| **PlanService** | `create(data)` | `name`, `description`, `frequency`, `price`, `currency`, `start_date` | Create subscription plan |
| | `publish(id)` | `plan_id` | Publish a draft plan |
| | `details(id)` | `plan_id` | Get plan details |
| | `list(params)` | `page_no`, `per_page` | List plans with pagination |
| | `update(id, data)` | `plan_id`, plan fields | Update a plan |
| | `delete(id)` | `plan_id` | Delete a plan |
| **WebhookService** | `register(data)` | `url`, `description` | Register webhook endpoint |

### Common Parameter Values

| Parameter | Type | Example Values |
|---|---|---|
| `provider` | string | `stripe`, `pagar_me`, `bridge`, `brla` |
| `target_role` | string | `connected_account`, `customer` |
| `currency` | string | `usd`, `brl`, `usdc`, `brla` |
| `payment_method.type` | string | `card`, `pix`, `bank`, `customer_wallet`, `virtual_account`, `liquidation_address` |
| `capture_method` | string | `automatic`, `manual` |

---

## Next Steps

- [Quickstart](/docs/sdk/quickstart) — 6-step universal integration flow
- [Customers](/docs/sdk/customers) — Customer management API
- [Payments](/docs/sdk/payments) — Payment processing API
- [Buy and Sell](/docs/sdk/buy-and-sell) — Crypto on/off-ramp
- [Transfers](/docs/sdk/transfers) — Fund movement
- [Plans](/docs/sdk/plans) — Subscription plans
- [Webhooks](/docs/sdk/webhooks) — Event handling
