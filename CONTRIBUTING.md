# Contributing to Oak Network

Thank you for your interest in contributing to Oak Network! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports** - Help us identify and fix issues
- **✨ Feature Requests** - Suggest new features or improvements
- **📝 Documentation** - Improve our docs and examples
- **💻 Code Contributions** - Submit bug fixes or new features
- **🧪 Testing** - Help improve test coverage
- **🔍 Security** - Report security vulnerabilities
- **🌍 Translations** - Help translate documentation

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and npm/yarn
- **Git** for version control
- **Hardhat** for smart contract development
- **Celo wallet** for testing
- **Basic knowledge** of Solidity and `ethers.js`

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/ccprotocol-contracts.git
   cd ccprotocol-contracts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📝 Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-new-treasury-type`
- `fix/campaign-creation-bug`
- `docs/update-integration-guide`
- `test/add-coverage-for-utils`

### Commit Messages

Follow conventional commits:
```
feat: add new treasury type for flexible funding
fix: resolve campaign creation validation issue
docs: update quick start guide
test: add unit tests for CampaignInfoFactory
refactor: improve error handling in treasury contracts
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run coverage
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide a clear description
   - Link related issues
   - Request reviews from maintainers

## 🧪 Testing Guidelines

### Test Structure

```
test/
├── foundry/
│   ├── unit/           # Unit tests for individual contracts
│   ├── integration/    # Integration tests for contract interactions
│   └── utils/          # Test utilities and helpers
└── mocks/              # Mock contracts for testing
```

### Writing Tests

```solidity
// Example test structure
contract CampaignInfoFactoryTest is Test {
    CampaignInfoFactory factory;
    address owner = makeAddr("owner");
    
    function setUp() public {
        factory = new CampaignInfoFactory();
    }
    
    function testCreateCampaign() public {
        // Arrange
        string memory title = "Test Campaign";
        uint256 goal = 1000 ether;
        
        // Act
        address campaign = factory.createCampaign(title, goal);
        
        // Assert
        assertTrue(campaign != address(0));
        assertEq(CampaignInfo(campaign).title(), title);
    }
}
```

### Test Requirements

- **Unit Tests** - Test individual contract functions
- **Integration Tests** - Test contract interactions
- **Edge Cases** - Test boundary conditions
- **Error Cases** - Test failure scenarios
- **Gas Optimization** - Monitor gas usage

## 📚 Documentation Standards

### Code Documentation

```solidity
/// @title CampaignInfoFactory
/// @notice Factory contract for creating campaign instances
/// @dev This contract manages the creation and tracking of campaigns
contract CampaignInfoFactory {
    /// @notice Creates a new campaign
    /// @param title The campaign title
    /// @param goal The funding goal in wei
    /// @return campaign The address of the created campaign
    function createCampaign(
        string memory title,
        uint256 goal
    ) external returns (address campaign) {
        // Implementation
    }
}
```

### README Updates

When adding new features:
- Update the main README.md
- Add examples to integration guides
- Update the architecture diagrams
- Include new contract addresses

## 🔒 Security Guidelines

### Security Considerations

- **Access Control** - Implement proper role-based access
- **Input Validation** - Validate all external inputs
- **Reentrancy** - Use checks-effects-interactions pattern
- **Integer Overflow** - Use SafeMath or Solidity 0.8+
- **Gas Limits** - Consider gas optimization
- **Upgradeability** - Plan for contract upgrades

### Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead:
1. Email security@oak.network
2. Use our [bug bounty program](https://hackerone.com/oaknetwork)
3. Follow responsible disclosure practices

## 🎨 Code Style

### Solidity Style Guide

```solidity
// Use camelCase for functions and variables
function createCampaign(string memory title) external {
    // Use descriptive variable names
    address newCampaign = address(new CampaignInfo(title));
    
    // Use events for important state changes
    emit CampaignCreated(newCampaign, title);
}

// Use UPPER_CASE for constants
uint256 public constant MAX_CAMPAIGN_DURATION = 365 days;

// Use descriptive error messages
error CampaignNotFound(address campaign);
error InsufficientFunds(uint256 required, uint256 available);
```

### JavaScript/TypeScript Style

```javascript
// Use camelCase for functions and variables
const createCampaign = async (title, goal) => {
  // Use descriptive variable names
  const campaignFactory = new ethers.Contract(factoryAddress, abi, signer);
  
  // Use async/await for promises
  const tx = await campaignFactory.createCampaign(title, goal);
  const receipt = await tx.wait();
  
  return receipt;
};
```

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Gas optimization reviewed
- [ ] Contract addresses updated

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the golden rule

### Getting Help

- **Discord** - Join our community chat
- **GitHub Discussions** - Ask questions and share ideas
- **Documentation** - Check our comprehensive docs
- **Issues** - Search existing issues before creating new ones

## 📊 Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** - List of all contributors
- **Release Notes** - Highlighted contributions
- **Community** - Recognition in our Discord
- **GitHub** - Contributor badges and mentions

## 🎉 Thank You

Thank you for contributing to Oak Network! Your contributions help us build a better, more accessible crowdfunding infrastructure for everyone.

---

**Questions?** Reach out to us on [Discord](https://discord.gg/oaknetwork) or [GitHub Discussions](https://github.com/oaknetwork/ccprotocol-contracts/discussions).

