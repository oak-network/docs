# Oak Network: Our Open Source Philosophy & Partnership Framework

This document outlines the core principles that guide our development, our partnership model, and our commitment to building a secure, transparent, and innovative ecosystem.

## Our Core Philosophy: Open Source & Security

The DNA of Oak Network is built on two pillars: a commitment to open source and an unwavering focus on security.

We believe that transparency is the foundation of trust. By building in public, we invite our partners and the broader community to scrutinize our code, contribute to its improvement, and verify its integrity. This open collaboration, combined with a security-first engineering culture, allows us to build a robust and resilient platform for everyone.

## Our Open Source Model: A Responsible, Phased Approach

Our goal is to open-source our entire product suite eventually. We are taking a responsible, phased approach to ensure that any code released to the public meets the highest standards of security and quality.

### Immediate Open Source (MIT License)
The foundational layers of our protocol are already open source. This includes trust-sensitive components like our smart contracts (ccprotocol-smart-contracts), the developer SDK (catalyst-sdk), and our core API (catalyst-api). These are the building blocks of the ecosystem and are available for anyone to use, audit, and build upon.

### Future Open Source
Other components will be open-sourced over time. We temporarily keep specific repositories private, not to hide them, but to ensure they are fully hardened, audited, and aligned with best practices before a public release. After careful validation and code quality assurance, we will make it public.

## A Special Note on Crowdsplit

Crowdsplit is our powerful service for orchestrating complex payment flows, fiat on/off-ramps, and compliance procedures. It's essential to understand its current status and our long-term thinking.

### Current Status
Crowdsplit is currently a proprietary, closed-source service.

### Our Rationale and Future Path
Our long-term vision for Crowdsplit, whether it becomes fully open source or remains proprietary, is a strategic decision we are carefully considering. Two equally essential factors guide this choice:

**Security & Compliance**: First and foremost, the service handles sensitive financial operations and compliance logic (KYC/AML). This requires a highly controlled and secure environment, making a premature open-source release irresponsible.

**Future Product Strategy**: Secondly, we are designing a roadmap of extended product offerings, including proprietary AI tooling and advanced analytics, that will be built upon Crowdsplit. We may maintain it as a proprietary service, but all integrations, API specs, and compliance interfaces will remain open, documented, and independently auditable.

### Our Unchanged Commitment to You
Regardless of our long-term decision on its source code, our commitment to our partners is firm: all integrations with Crowdsplit APIs, along with the necessary documentation and API access, will be provided free of charge. Its use is a core part of the platform, not a feature you have to pay for.

## Our Partnership Model & Future Vision

Our business model is straightforward: we sustain the ecosystem through a transparent 1% protocol fee and pass-through of external service costs, without any markup. In the future, we may develop optional, value-added tooling, such as advanced AI-driven analytics or campaign validation services. These services could be offered under a separate commercial license. This model enables us to fund the ongoing research and development of the free, open-source core, while also providing powerful, optional tools for partners who need them.

### 1% Protocol Fee
A small, fixed fee applied to total transaction volume processed through the Oak network. This funds ongoing development of the open-source core, security audits, and shared infrastructure.

### Pass-Through Provider Fees
CrowdSplit integrates with several payment, banking, and cloud providers (e.g., Stripe, PagarMe, Bridge, AWS). Each client's usage may incur these providers' native charges — like virtual account fees, processing costs, or cloud consumption. These are billed transparently at cost, with no profit margin for CrowdSplit.

## Ecosystem Best Practices & Protections

To ensure the health, security, and legal clarity of our ecosystem, we adhere to the following standards:

### Legal Protections

**Terms of Service (ToS)**: While our code is open, its use in our live production ecosystem is governed by a clear ToS. This is our primary tool for preventing fraud, abuse, and illegal activity, ensuring a safe environment for all users.

**Contributor License Agreement (CLA)**: For any community contributions to our open-source repositories, we will require a CLA. This is a standard practice that protects the project, the contributor, and our users by ensuring that all contributed code is appropriately licensed.

**Standard Disclaimers**: In line with all major open-source projects, our code is provided under a license (MIT) that includes a "NO WARRANTY" and "LIMITATION OF LIABILITY" clause.

### Technical Best Practices

**Third-Party Security Audits**: All smart contracts and critical infrastructure undergo rigorous, independent security audits before any mainnet deployment. We are committed to making these audit reports public.

**Semantic Versioning**: All our software packages and APIs follow semantic versioning (MAJOR.MINOR.PATCH). This ensures that you can manage updates and dependencies predictably, without unexpected breaking changes.

**Responsible Disclosure Policy**: We maintain a transparent and open channel for security researchers to report vulnerabilities. We believe in working with the security community to identify and resolve issues proactively.

## Technical Framework & Contribution Guide

This section provides the detailed technical specifications for how we manage our open-source projects and how you can effectively collaborate with us.

### Code Hosting & Repositories
All of our open-source code is hosted exclusively on GitHub under the official Oak Network organization.

Key public repositories include:

- **oak-smart-contracts**: The Solidity smart contracts that form the immutable logic of the protocol.
- **catalyst-sdk**: The primary SDK (in TypeScript/JavaScript) for client-side integration with our smart contracts.
- **catalyst-api**: The open-source API for querying on-chain data and interacting with the protocol.

### Licensing
All Oak Network open-source repositories are licensed under the MIT License. This is a highly permissive license chosen to maximize freedom for our developer community.

In practical terms, this means you are free to:

- Use the software in commercial and private applications.
- Modify, distribute, sublicense, and sell copies of the software.

The only requirement is that the original copyright notice and the MIT license text must be included with any substantial portion of the software you distribute.

### Open Source Contribution Model
We welcome and encourage community contributions. Our workflow is designed to be transparent and efficient, following standard GitHub best practices. All projects will be well-documented, with active discussions and a collaborative roadmap outlining future features.

**Issues**: All bug reports, feature requests, and technical proposals should be submitted as issues in the relevant GitHub repository. Before creating a new issue, please search existing issues to avoid duplicates.

**Pull Requests (PRs)**: The process for contributing code is as follows:

1. Fork the target repository.
2. Create a new, descriptive feature branch from the main or develop branch.
3. Commit your changes with clear, concise messages.
4. Ensure all code lints correctly and all existing tests pass. Add new tests for your features where applicable.
5. Submit a Pull Request to the original repository, clearly describing the changes you have made.
6. The core development team reviews all PRs. You may be asked to make changes before your contribution is merged.

### Communication Channels

- **For Technical Issues & Code Discussion**: Please use the GitHub Issues section of the relevant repository.
- **For Community Discussion & General Support**: Join our official Discord Server (link to be provided). This is the best place for real-time conversation with the core team and community.
- **For Guides & API Reference**: Our official developer documentation can be found soon at docs.oak.network.

## Conclusion: Our Commitment to a Lasting Partnership

This framework serves as the foundation for our collaboration with you. Our goal is to build a lasting partnership grounded in the shared principles of open innovation, uncompromising security, and mutual success.

To summarize how we work together:

- **We provide a clear model**: You gain access to a robust, open-source core protocol, while we strategically manage proprietary components like Crowdsplit to ensure ecosystem integrity and fund future development.

- **We believe in transparent value**: Your integration with our core infrastructure and APIs is straightforward. We are committed to a business model with no hidden costs, where essential services are part of the platform and our fee structure is clear.

- **We operate on a shared responsibility model**, committing to uphold the highest technical and security standards through third-party audits and responsible development practices. In return, we require that all partners operate within the legal framework of our Terms of Service to help us maintain a safe, reputable, and thriving ecosystem.

We view our partners as essential architects of the Oak Network's future. By establishing these principles upfront, we build the trust necessary for a long-term, collaborative relationship.

We are excited to build the future of this ecosystem with you.

**Welcome to the Oak Network.**
