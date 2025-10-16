# Contract Deployment

This guide covers how to deploy Oak Network smart contracts to the Celo blockchain.

## Prerequisites

- Node.js and npm/pnpm installed
- Foundry installed
- Celo wallet with testnet/mainnet CELO
- Environment variables configured

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/oaknetwork/ccprotocol-contracts
cd ccprotocol-contracts
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://celo-alfajores.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 4. Deploy Contracts

#### Deploy All Contracts

```bash
forge script script/DeployAll.s.sol --rpc-url $RPC_URL --broadcast --verify
```

#### Deploy Individual Contracts

```bash
# Deploy GlobalParams
forge script script/DeployGlobalParams.s.sol --rpc-url $RPC_URL --broadcast --verify

# Deploy CampaignInfoFactory
forge script script/DeployCampaignInfoFactory.s.sol --rpc-url $RPC_URL --broadcast --verify

# Deploy TreasuryFactory
forge script script/DeployTreasuryFactory.s.sol --rpc-url $RPC_URL --broadcast --verify
```

## Contract Addresses

### Mainnet (Celo)
- GlobalParams: `TBD`
- CampaignInfoFactory: `TBD`
- TreasuryFactory: `TBD`

### Testnet (Alfajores)
- GlobalParams: `TBD`
- CampaignInfoFactory: `TBD`
- TreasuryFactory: `TBD`

## Verification

After deployment, verify your contracts on CeloScan:

```bash
forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> --etherscan-api-key $ETHERSCAN_API_KEY --chain celo
```

## Next Steps

- [Smart Contract Reference](/docs/contracts/overview) - Complete contract documentation
- [Integration Guides](/docs/guides/quick-start) - Start building with deployed contracts
- [Security Overview](/docs/security/overview) - Security best practices
