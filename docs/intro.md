# Welcome to Oak Network

Oak Network is a decentralized, censorship-resistant crowdfunding protocol built on Celo. We provide infrastructure that any platform can integrate to enable secure, transparent, and accessible fundraising for creators, entrepreneurs, and communities.

import MermaidDiagram from '@site/src/components/MermaidDiagram';

<MermaidDiagram title="Oak Network Architecture">

```mermaid
graph TB
    A[Campaign Creator] --> B[CampaignInfoFactory]
    B --> C[CampaignInfo Contract]
    C --> D[TreasuryFactory]
    D --> Beyond[Treasury Contract]
    Beyond --> F[Platform Integration]
    F --> G[Backers]
    
    H[GlobalParams] --> B
    H --> D
    
    I[Platform Admin] --> C
    J[Protocol Admin] --> H
```

</MermaidDiagram>

## Why Oak Network?

### 🎯 Decentralized & Censorship-Resistant
Campaigns live on-chain, ensuring they cannot be removed or altered by any central authority.

### 🔐 Security First
Our smart contracts are audited by **Immunefi** with an ongoing **OpenZeppelin** audit, and are part of **Immunefi's bug bounty program** with rewards up to $50,000.

### 🌍 Multi-Platform
Oak Network is infrastructure - integrate it into your existing platform to add crowdfunding capabilities.

### 💰 Flexible Treasuries
Choose from different treasury models like "All-or-Nothing" to suit your funding needs.

### 🚀 Developer-Friendly
Comprehensive documentation, SDKs, and integration guides to get you started quickly.

## Quick Links

- [Choose Your Integration Path](/docs/guides/integration-overview) - Find the right integration approach
- [Create Your First Campaign](/docs/guides/create-campaign) - Get started in minutes
- [Payment SDK Quick Start](/docs/guides/payment-sdk-quickstart) - 6-step fiat payment integration
- [Contracts SDK Quick Start](/docs/guides/contracts-sdk-quickstart) - Deploy crypto-native campaigns
- [Core Concepts](/docs/concepts/overview) - Understand the protocol
- [Smart Contracts](/docs/contracts/overview) - Technical reference
- [Security](/docs/security/overview) - Security architecture and audits

## Get Started

Ready to build? Start with [Choose Your Integration Path](/docs/guides/integration-overview) to find the right approach for your platform, or jump straight into [Create Your First Campaign](/docs/guides/create-campaign) to get started in minutes.