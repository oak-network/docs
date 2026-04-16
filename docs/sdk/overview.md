---
sidebar_label: Overview
---

# Payment SDK

The `@oaknetwork/payments-sdk` package is a TypeScript SDK that wraps the Oak Network payment API — handling authentication, retries, and type safety so you can focus on building your integration.

import MermaidDiagram from '@site/src/components/MermaidDiagram';

:::tip Get your API credentials
To start building with the SDK, you need a **Client ID** and **Client Secret**. Reach out to **[support@oaknetwork.org](mailto:support@oaknetwork.org)** to get your sandbox credentials and start integrating today.
:::

## Highlights

- **Initialize a client** for sandbox or production: `createOakClient({ environment: 'sandbox', ... })`
- **Standalone service factories** — import only what you need: `createCustomerService(client)`, `createPaymentService(client)`, etc.
- **Type-safe results** on every call: every method returns `Result<T, OakError>` — no uncaught exceptions
- **Built-in retry** with exponential backoff, jitter, and `Retry-After` header support
- **Webhook signature verification** built in: `verifyWebhookSignature()` and `parseWebhookPayload()`
- **Two environments** out of the box: `sandbox` and `production`, plus `customUrl` for self-hosted setups

---

## Complete Money Flow

<MermaidDiagram title="Payment SDK Money Flow">

```mermaid
flowchart TD
    subgraph Setup["Phase 1: Setup"]
        Auth[Authentication] --> CustReg[Customer Registration]
        CustReg --> ProvReg[Provider Registration]
        ProvReg --> KYC[KYC Completion]
    end
    
    subgraph Collection["Phase 2: Payment Collection"]
        Payment{Payment Type?}
        Payment -->|Card| CardPay[Card Payment]
        Payment -->|PIX| PixPay[PIX Payment]
        Payment -->|Bank| BankPay[Bank Transfer]
        CardPay --> Captured[Payment Captured]
        PixPay --> Captured
        BankPay --> Captured
    end
    
    subgraph PostPayment["Phase 3: Post-Payment"]
        PostOps{Post-Payment Operations?}
        PostOps -->|Refund| Refund[Refund Service]
        PostOps -->|Dispute| Dispute[Dispute Management]
        PostOps -->|Continue| FundsReady[Funds Ready]
    end
    
    subgraph Movement["Phase 4: Fund Movement"]
        MoveFunds{Move Funds?}
        MoveFunds -->|To Bank| Transfer[Transfer Service]
        MoveFunds -->|To Crypto| Buy[Buy Service]
        MoveFunds -->|Hold| Hold[Hold in Account]
        Buy --> CryptoWallet[Crypto Wallet]
        CryptoWallet -->|Off-Ramp| Sell[Sell Service]
        Sell --> BankAccount[Bank Account]
        Transfer --> BankAccount
    end
    
    subgraph Recurring["Phase 5: Subscriptions"]
        Plans[Create Plans] --> Subscribe[Subscribe Customers]
        Subscribe --> AutoBill[Auto-billing]
    end
    
    KYC --> Payment
    Captured --> PostOps
    FundsReady --> MoveFunds
    FundsReady -.->|Optional| Plans
    AutoBill -.-> Payment
```

</MermaidDiagram>

---

## When to Use Each Operation

<MermaidDiagram title="Operation Decision Guide">

```mermaid
flowchart TD
    Start([Need to Move Money?]) --> Direction{Direction?}
    
    Direction -->|Collect from Backer| Collect{One-time or Recurring?}
    Direction -->|Send to Creator| Send{Recipient Type?}
    Direction -->|Convert Currency| Convert{Conversion Type?}
    
    Collect -->|One-time| Payment[Payment Service]
    Collect -->|Recurring| Plans[Plan Service + Subscribe]
    
    Send -->|To Bank Account| Transfer[Transfer Service]
    Send -->|To Crypto Wallet| TransferCrypto[Transfer Service]
    Send -->|To Another Customer| TransferInternal[Transfer Service]
    
    Convert -->|Fiat to Crypto| Buy[Buy Service]
    Convert -->|Crypto to Fiat| Sell[Sell Service]
    
    Payment --> Captured[Payment Captured]
    Captured --> NeedRefund{Need Refund?}
    NeedRefund -->|Yes| Refund[Refund Service]
    NeedRefund -->|No| Done([Complete])
```

</MermaidDiagram>

| Operation | Service | Use Case | Providers |
|---|---|---|---|
| **Payment** | `PaymentService` | Collect funds from backer (card, PIX) | Stripe, PagarMe, MercadoPago |
| **Refund** | `RefundService` | Return funds from a captured payment | Same as payment provider |
| **Transfer** | `TransferService` | Move funds to bank, wallet, or customer | Stripe, PagarMe, BRLA |
| **Buy** | `BuyService` | Convert fiat → crypto (on-ramp) | Bridge |
| **Sell** | `SellService` | Convert crypto → fiat (off-ramp) | Bridge |
| **Plans** | `PlanService` | Define recurring billing plans | All |

---

## Quick example

```typescript
import { createOakClient, createCustomerService } from '@oaknetwork/payments-sdk';

const client = createOakClient({
  environment: 'sandbox',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const customers = createCustomerService(client);

const result = await customers.list();

if (result.ok) {
  console.log(result.value.data);
} else {
  console.error(result.error.message);
}
```

> See the full walkthrough in the [Quickstart](/docs/sdk/quickstart) guide.

## Start here

- [Installation](/docs/sdk/installation) — Install the package and configure credentials
- [Quickstart](/docs/sdk/quickstart) — 6-step universal integration flow
- [Choose Your Integration Path](/docs/guides/integration-overview) — Compare Payment SDK vs Contracts SDK

## Services

The SDK ships 10 service modules. Import the factory function for each service you need.

| Service | Factory | What it does |
|---|---|---|
| [`CustomerService`](/docs/sdk/customers) | `createCustomerService(client)` | Create, get, list, update, sync, and check balances |
| [`PaymentService`](/docs/sdk/payments) | `createPaymentService(client)` | Create, confirm, cancel payments |
| [`PaymentMethodService`](/docs/sdk/payment-methods) | `createPaymentMethodService(client)` | Add, list, get, delete payment methods |
| [`WebhookService`](/docs/sdk/webhooks) | `createWebhookService(client)` | Register, manage, and monitor webhooks |
| [`TransactionService`](/docs/sdk/transactions) | `createTransactionService(client)` | List, get, and settle transactions |
| [`TransferService`](/docs/sdk/transfers) | `createTransferService(client)` | Create provider transfers (Stripe, PagarMe, BRLA) |
| [`PlanService`](/docs/sdk/plans) | `createPlanService(client)` | CRUD subscription plans |
| [`RefundService`](/docs/sdk/refunds) | `createRefundService(client)` | Refund a payment |
| [`BuyService`](/docs/sdk/buy-and-sell) | `createBuyService(client)` | Crypto on-ramp via Bridge |
| [`SellService`](/docs/sdk/buy-and-sell) | `createSellService(client)` | Crypto off-ramp |

## Next up

- [Installation](/docs/sdk/installation) — install the package and configure credentials
- [Quickstart](/docs/sdk/quickstart) — your first working integration in under 5 minutes
- [Error Handling](/docs/sdk/error-handling) — understand the `Result<T>` pattern and error types
