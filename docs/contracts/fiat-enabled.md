# FiatEnabled

The `FiatEnabled` contract provides functionality for tracking and managing fiat currency transactions in campaigns. It allows tracking fiat contributions, managing fiat fee disbursement, and integrating traditional payment methods.

## Overview

```solidity
abstract contract FiatEnabled {
    uint256 internal s_fiatRaisedAmount;
    bool internal s_fiatFeeIsDisbursed;
    mapping(bytes32 => uint256) internal s_fiatAmountById;
    
    event FiatTransactionUpdated(bytes32 indexed fiatTransactionId, uint256 amount);
    event FiatFeeDisbusementStateUpdated(bool isDisbursed, uint256 protocolFeeAmount, uint256 platformFeeAmount);
    
    error FiatEnabledAlreadySet();
    error FiatEnabledDisallowedState();
    error FiatEnabledInvalidTransaction();
}
```

## Purpose

- **Fiat Integration**: Support traditional payment methods
- **Transaction Tracking**: Record individual fiat transactions
- **Fee Management**: Track fiat fee disbursement
- **Hybrid Funding**: Support both crypto and fiat contributions
- **Compliance**: Enable fiat payment compliance

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `s_fiatRaisedAmount` | `uint256` | Total fiat amount raised |
| `s_fiatFeeIsDisbursed` | `bool` | Whether fiat fees have been disbursed |
| `s_fiatAmountById` | `mapping(bytes32 => uint256)` | Fiat amounts by transaction ID |

## Functions

### Get Fiat Raised Amount

```solidity
function getFiatRaisedAmount() public view returns (uint256);
```

**Returns:**
- Total amount of fiat raised

**Usage:**
- Display total fiat contributions
- Calculate campaign totals including fiat

### Get Fiat Transaction Amount

```solidity
function getFiatTransactionAmount(bytes32 fiatTransactionId) 
    external 
    view 
    returns (uint256 amount);
```

**Parameters:**
- `fiatTransactionId`: Unique transaction identifier

**Returns:**
- Amount of the specific fiat transaction

**Requirements:**
- Transaction must exist
- Returns error if transaction not found

### Check If Fiat Fee Disbursed

```solidity
function checkIfFiatFeeDisbursed() external view returns (bool);
```

**Returns:**
- True if fiat fees have been disbursed

**Usage:**
- Check if fiat fees can be collected
- Verify fee distribution status

### Update Fiat Transaction (Internal)

```solidity
function _updateFiatTransaction(
    bytes32 fiatTransactionId,
    uint256 fiatTransactionAmount
) internal;
```

**Parameters:**
- `fiatTransactionId`: Transaction identifier
- `fiatTransactionAmount`: Transaction amount

**Effects:**
- Stores transaction amount
- Updates total fiat raised
- Emits `FiatTransactionUpdated` event

**Note:** Internal function, called by contract owner

### Update Fiat Fee Disbursement State (Internal)

```solidity
function _updateFiatFeeDisbursementState(
    bool isDisbursed,
    uint256 protocolFeeAmount,
    uint256 platformFeeAmount
) internal;
```

**Parameters:**
- `isDisbursed`: Whether fees are disbursed
- `protocolFeeAmount`: Protocol fee amount
- `platformFeeAmount`: Platform fee amount

**Effects:**
- Marks fiat fees as disbursed
- Emits `FiatFeeDisbusementStateUpdated` event
- Can only be called once

**Requirements:**
- Fees must not already be disbursed
- Must mark as disbursed

## Events

### FiatTransactionUpdated

```solidity
event FiatTransactionUpdated(
    bytes32 indexed fiatTransactionId,
    uint256 fiatTransactionAmount
);
```

**Emitted when:** Fiat transaction is updated
**Includes:** Transaction ID and amount

### FiatFeeDisbusementStateUpdated

```solidity
event FiatFeeDisbusementStateUpdated(
    bool isDisbursed,
    uint256 protocolFeeAmount,
    uint256 platformFeeAmount
);
```

**Emitted when:** Fiat fee disbursement state changes
**Includes:** Disbursement status and fee amounts

## Errors

### FiatEnabledAlreadySet

```solidity
error FiatEnabledAlreadySet();
```

**Thrown when:** Attempting to set fee disbursement when already set

### FiatEnabledDisallowedState

```solidity
error FiatEnabledDisallowedState();
```

**Thrown when:** Fee disbursement state is invalid

### FiatEnabledInvalidTransaction

```solidity
error FiatEnabledInvalidTransaction();
```

**Thrown when:** Querying non-existent transaction

## Usage Examples

### Recording Fiat Transactions

```javascript
// Record a fiat payment
const transactionId = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('stripe-payment-12345')
);
const amount = ethers.utils.parseEther('100'); // $100

// Update transaction (internal function called by owner)
await treasury._updateFiatTransaction(transactionId, amount);

// Listen for event
treasury.on('FiatTransactionUpdated', (txId, amount, event) => {
  console.log('Fiat transaction recorded:', ethers.utils.formatEther(amount));
});
```

### Tracking Fiat Contributions

```javascript
// Get total fiat raised
const fiatRaised = await treasury.getFiatRaisedAmount();
console.log('Fiat raised:', ethers.utils.formatEther(fiatRaised), 'USD');

// Get total crypto raised
const cryptoRaised = await treasury.getTotalPledged();

// Total campaign funding
const totalFunding = fiatRaised.add(cryptoRaised);
console.log('Total funding:', ethers.utils.formatEther(totalFunding));
```

### Checking Transaction

```javascript
// Verify a fiat transaction
const transactionId = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('stripe-payment-12345')
);

try {
  const amount = await treasury.getFiatTransactionAmount(transactionId);
  console.log('Transaction amount:', ethers.utils.formatEther(amount));
} catch (error) {
  if (error.message.includes('FiatEnabledInvalidTransaction')) {
    console.log('Transaction not found');
  }
}
```

### Disbursing Fiat Fees

```javascript
// Disburse fiat fees
const protocolFee = ethers.utils.parseEther('2');
const platformFee = ethers.utils.parseEther('3');

await treasury._updateFiatFeeDisbursementState(true, protocolFee, platformFee);

// Check if fees disbursed
const feesDisbursed = await treasury.checkIfFiatFeeDisbursed();
console.log('Fees disbursed:', feesDisbursed);
```

## Integration

### With On-Ramp Services

```javascript
// Integrate with Stripe, Plaid, etc.
async function processFiatPayment(paymentMethod, amount) {
  // Process payment through on-ramp
  const transaction = await stripe.charges.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    source: paymentMethod
  });
  
  // Record in treasury
  const transactionId = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`stripe-${transaction.id}`)
  );
  
  await treasury._updateFiatTransaction(
    transactionId,
    ethers.utils.parseEther(amount.toString())
  );
  
  return transactionId;
}
```

### Hybrid Funding

```javascript
// Track both crypto and fiat
async function getTotalFunding() {
  const cryptoRaised = await treasury.getTotalPledged();
  const fiatRaised = await treasury.getFiatRaisedAmount();
  
  // Convert fiat to crypto equivalent (using oracle)
  const exchangeRate = await getUSDToTokenRate();
  const fiatInTokens = fiatRaised.mul(exchangeRate).div(ethers.constants.WeiPerEther);
  
  const totalFunding = cryptoRaised.add(fiatInTokens);
  return totalFunding;
}
```

## Security Considerations

### Transaction Verification

- Verify fiat transactions off-chain
- Use secure payment processors
- Maintain audit trail

### Fee Disbursement

- Only once, irreversible
- Calculate fees accurately
- Track both protocol and platform fees

### State Protection

- Cannot undo disbursement
- Must verify before disbursing
- Track all transactions

## Best Practices

### Record Transactions Promptly

```javascript
// Record immediately after payment success
await paymentProcessor.charge(amount).then(async (result) => {
  if (result.success) {
    await treasury._updateFiatTransaction(
      generateTransactionId(result),
      amount
    );
  }
});
```

### Audit Trail

```javascript
// Listen to all events
treasury.on('FiatTransactionUpdated', (txId, amount, event) => {
  // Store in database
  await database.recordFiatTransaction({
    campaignId,
    transactionId: txId,
    amount,
    timestamp: event.blockTimestamp
  });
});
```

## Next Steps

- [ItemRegistry](./item-registry.md) - Item management
- [BaseTreasury](./base-treasury.md) - Treasury base contract

