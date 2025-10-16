# Deployment Guide

This guide covers deploying Oak Network smart contracts to various networks and environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Testnet Deployment](#testnet-deployment)
- [Mainnet Deployment](#mainnet-deployment)
- [Verification](#verification)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software

- **Node.js** 16+ and npm/yarn
- **Git** for version control
- **Hardhat** for smart contract development
- **Celo CLI** for network interaction
- **MetaMask** or compatible wallet

### Required Accounts

- **Deployer Account** - Account with CELO for gas fees
- **Admin Account** - Account for protocol administration
- **Treasury Account** - Account for protocol fees

## 🌍 Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/oaknetwork/ccprotocol-contracts.git
cd ccprotocol-contracts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create environment files for different networks:

```bash
# Copy example environment file
cp .env.example .env

# Create network-specific files
cp .env.example .env.local
cp .env.example .env.testnet
cp .env.example .env.mainnet
```

### 4. Configure Environment Variables

```bash
# .env.local
NETWORK=localhost
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your_private_key_here
ADMIN_ADDRESS=your_admin_address_here
TREASURY_ADDRESS=your_treasury_address_here

# .env.testnet
NETWORK=alfajores
RPC_URL=https://alfajores-forno.celo-testnet.org
PRIVATE_KEY=your_private_key_here
ADMIN_ADDRESS=your_admin_address_here
TREASURY_ADDRESS=your_treasury_address_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# .env.mainnet
NETWORK=celo
RPC_URL=https://forno.celo.org
PRIVATE_KEY=your_private_key_here
ADMIN_ADDRESS=your_admin_address_here
TREASURY_ADDRESS=your_treasury_address_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🏠 Local Development

### 1. Start Local Network

```bash
# Start Hardhat local network
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Deploy Script

```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy GlobalParams
  const GlobalParams = await ethers.getContractFactory("GlobalParams");
  const globalParams = await GlobalParams.deploy();
  await globalParams.deployed();
  console.log("GlobalParams deployed to:", globalParams.address);

  // Deploy TreasuryFactory
  const TreasuryFactory = await ethers.getContractFactory("TreasuryFactory");
  const treasuryFactory = await TreasuryFactory.deploy(globalParams.address);
  await treasuryFactory.deployed();
  console.log("TreasuryFactory deployed to:", treasuryFactory.address);

  // Deploy CampaignInfoFactory
  const CampaignInfoFactory = await ethers.getContractFactory("CampaignInfoFactory");
  const campaignFactory = await CampaignInfoFactory.deploy(
    globalParams.address,
    treasuryFactory.address
  );
  await campaignFactory.deployed();
  console.log("CampaignInfoFactory deployed to:", campaignFactory.address);

  // Deploy Treasury Implementations
  const AllOrNothing = await ethers.getContractFactory("AllOrNothing");
  const allOrNothing = await AllOrNothing.deploy();
  await allOrNothing.deployed();
  console.log("AllOrNothing deployed to:", allOrNothing.address);

  const KeepWhatsRaised = await ethers.getContractFactory("KeepWhatsRaised");
  const keepWhatsRaised = await KeepWhatsRaised.deploy();
  await keepWhatsRaised.deployed();
  console.log("KeepWhatsRaised deployed to:", keepWhatsRaised.address);

  // Set treasury implementations
  await treasuryFactory.setTreasuryImplementation("AllOrNothing", allOrNothing.address);
  await treasuryFactory.setTreasuryImplementation("KeepWhatsRaised", keepWhatsRaised.address);

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 🧪 Testnet Deployment

### 1. Get Testnet CELO

Visit the [Celo Faucet](https://faucet.celo.org/) to get testnet CELO.

### 2. Deploy to Alfajores

```bash
# Deploy to Alfajores testnet
npx hardhat run scripts/deploy.js --network alfajores

# Verify contracts
npx hardhat verify --network alfajores <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 3. Test Deployment

```bash
# Run integration tests
npx hardhat test --network alfajores

# Run specific test file
npx hardhat test test/integration/Deployment.t.js --network alfajores
```

## 🌐 Mainnet Deployment

### 1. Pre-deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas optimization reviewed
- [ ] Contract addresses documented
- [ ] Emergency procedures defined
- [ ] Multi-sig wallet configured

### 2. Deploy to Mainnet

```bash
# Deploy to Celo mainnet
npx hardhat run scripts/deploy.js --network celo

# Verify contracts
npx hardhat verify --network celo <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 3. Post-deployment Setup

```bash
# Set protocol parameters
npx hardhat run scripts/setup.js --network celo

# Transfer admin roles to multi-sig
npx hardhat run scripts/transfer-admin.js --network celo
```

## ✅ Verification

### 1. Contract Verification

```bash
# Verify single contract
npx hardhat verify --network celo <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Verify all contracts
npx hardhat run scripts/verify.js --network celo
```

### 2. Verification Script

```javascript
// scripts/verify.js
const { run } = require("hardhat");

async function main() {
  const contracts = [
    {
      address: "0x...", // GlobalParams
      constructorArgs: []
    },
    {
      address: "0x...", // TreasuryFactory
      constructorArgs: ["0x..."] // GlobalParams address
    },
    {
      address: "0x...", // CampaignInfoFactory
      constructorArgs: ["0x...", "0x..."] // GlobalParams, TreasuryFactory
    }
  ];

  for (const contract of contracts) {
    try {
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
      });
      console.log(`✅ Verified ${contract.address}`);
    } catch (error) {
      console.log(`❌ Failed to verify ${contract.address}:`, error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## ⚙️ Configuration

### 1. Protocol Parameters

```javascript
// scripts/setup.js
const { ethers } = require("hardhat");

async function main() {
  const globalParams = await ethers.getContractAt("GlobalParams", GLOBAL_PARAMS_ADDRESS);
  
  // Set protocol fee (1% = 100 basis points)
  await globalParams.setProtocolFee(100);
  
  // Set minimum campaign duration (1 day)
  await globalParams.setMinCampaignDuration(86400);
  
  // Set maximum campaign duration (1 year)
  await globalParams.setMaxCampaignDuration(31536000);
  
  console.log("Protocol parameters configured");
}
```

### 2. Access Control Setup

```javascript
// scripts/setup-roles.js
const { ethers } = require("hardhat");

async function main() {
  const campaignFactory = await ethers.getContractAt("CampaignInfoFactory", CAMPAIGN_FACTORY_ADDRESS);
  
  // Grant campaign creator role
  const CAMPAIGN_CREATOR_ROLE = await campaignFactory.CAMPAIGN_CREATOR_ROLE();
  await campaignFactory.grantRole(CAMPAIGN_CREATOR_ROLE, CAMPAIGN_CREATOR_ADDRESS);
  
  // Grant pauser role
  const PAUSER_ROLE = await campaignFactory.PAUSER_ROLE();
  await campaignFactory.grantRole(PAUSER_ROLE, PAUSER_ADDRESS);
  
  console.log("Access control configured");
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Insufficient Gas

```bash
# Increase gas limit
npx hardhat run scripts/deploy.js --network celo --gas-limit 8000000
```

#### 2. Transaction Reverted

```bash
# Check transaction details
npx hardhat run scripts/debug.js --network celo
```

#### 3. Verification Failed

```bash
# Check constructor arguments
npx hardhat verify --network celo <CONTRACT_ADDRESS> --show-stack-traces
```

### Debug Script

```javascript
// scripts/debug.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.utils.formatEther(await deployer.getBalance()));
  
  // Check network
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, network.chainId);
  
  // Check gas price
  const gasPrice = await ethers.provider.getGasPrice();
  console.log("Gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 📊 Deployment Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Private keys secured
- [ ] Gas estimates calculated
- [ ] Constructor arguments prepared
- [ ] Testnet deployment successful

### During Deployment

- [ ] Monitor gas usage
- [ ] Record contract addresses
- [ ] Verify constructor arguments
- [ ] Check transaction confirmations

### Post-deployment

- [ ] Verify contracts on block explorer
- [ ] Configure protocol parameters
- [ ] Set up access control
- [ ] Test contract functionality
- [ ] Update documentation
- [ ] Notify community

## 🔒 Security Considerations

### Private Key Management

- Use hardware wallets for mainnet deployments
- Never commit private keys to version control
- Use environment variables for sensitive data
- Consider multi-sig wallets for admin functions

### Contract Security

- Verify all contracts on block explorer
- Use proxy patterns for upgradeable contracts
- Implement proper access control
- Test emergency procedures

### Network Security

- Use official RPC endpoints
- Verify network parameters
- Monitor for suspicious activity
- Keep deployment scripts secure

---

**Need help?** Check our [troubleshooting guide](troubleshooting.md) or join our [Discord community](https://discord.gg/oaknetwork).
