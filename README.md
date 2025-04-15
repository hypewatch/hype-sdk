# Hype SDK

The Hype SDK is a comprehensive toolkit for interacting with the Hype Protocol on the Solana blockchain. It provides developers with a powerful and intuitive interface to build applications that leverage the full capabilities of the Hype Protocol ecosystem.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Concepts](#core-concepts)
5. [Reference](#reference)
   - [Initialization Methods](#initialization-methods)
   - [User Methods](#user-methods)
   - [Token Methods](#token-methods)
   - [Transaction Building Methods](#transaction-building-methods)
   - [Transaction Listener Methods](#transaction-listener-methods)
6. [Data Types](#data-types)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)
9. [Development](#development)
10. [License](#license)

## Introduction

### What is the Hype Protocol?

The Hype Protocol is a decentralized platform built on Solana that enables the creation, trading, and management of tokenized assets. It provides a robust infrastructure for social tokens, creator economies, and decentralized finance applications with high performance and low transaction costs.

### Key Features

- **Token Management**: Create, mint, and burn tokens with simple API calls
- **User Portfolio**: Track user balances, token holdings, and transaction history
- **Real-time Monitoring**: Listen for and react to on-chain transactions as they occur
- **Referral System**: Manage and track user referrals and associated earnings
- **Comprehensive Filtering**: Advanced token list filtering, sorting, and pagination
- **Transaction Building**: Simplified transaction creation and submission
- **Solana Integration**: Seamless integration with the Solana blockchain


## Installation

Install the Hype SDK using npm:

```bash
npm install @hypewatch/hype-sdk
```

Or using yarn:

```bash
yarn add @hypewatch/hype-sdk
```


## Quick Start

### Basic SDK Initialization

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

// Initialize with default parameters
const sdk = new HypeSDK()

// Or initialize with custom parameters
const customSdk = new HypeSDK(
  new PublicKey('your-program-id'), // Custom program ID
  1, // Protocol version
  'https://api.mainnet-beta.solana.com' // Custom RPC URL
)

// Initialize the root account (required before using other methods)
async function initialize() {
  try {
    await sdk.initRoot()
    console.log('SDK initialized successfully')

    // Now you can use other SDK methods
    const userPublicKey = new PublicKey('user-wallet-address')
    const userTokens = await sdk.getUserTokens(userPublicKey)
    console.log('User tokens:', userTokens)
  } catch (error) {
    console.error('Failed to initialize SDK:', error)
  }
}

initialize()
```


## Core Concepts

### Method Categories

| Category                 | Methods                                                                         | Description                                                                              |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Initialization**       | `constructor`<br>`initRoot`<br>`printFullRoot`                                  | Methods for initializing the SDK and setting up the connection to the Hype Protocol      |
| **User Methods**         | `getUserTokens`<br>`getUserBalance`<br>`getUserPortfolio`<br>`getUserReferrals` | Methods for retrieving user-related data such as token holdings, balances, and referrals |
| **Token Methods**        | `getTokenList`<br>`getTokenLastTransaction`                                     | Methods for retrieving token data and transaction history                                |
| **Transaction Building** | `buildMintTxnIx`<br>`buildBurnTxnIx`<br>`buildCreatexnIx`<br>`buildTradeTxn`    | Methods for creating transaction instructions for various token operations               |
| **Transaction Listener** | `initTransactionListener`<br>`stopTransactionListener`                          | Methods for monitoring real-time blockchain transactions                                 |


## Reference

### Initialization Methods

#### Constructor

```typescript
constructor(
  programId: PublicKey = DEFAULT_PROGRAM_ID,
  version: number = DEFAULT_VERSION,
  rpcURL: string = DEFAULT_RPC_URL
)
```

| Parameter   | Type        | Description                                      | Default              |
| ----------- | ----------- | ------------------------------------------------ | -------------------- |
| `programId` | `PublicKey` | The program ID of the Hype Protocol              | `DEFAULT_PROGRAM_ID` |
| `version`   | `number`    | The version of the protocol being used           | `DEFAULT_VERSION`    |
| `rpcURL`    | `string`    | The Solana RPC URL for connecting to the network | `DEFAULT_RPC_URL`    |

**Description:**
Creates a new instance of the HypeSDK with the specified parameters. If no parameters are provided, default values are used.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

// Initialize with default parameters
const defaultSdk = new HypeSDK()

// Initialize with custom parameters
const customSdk = new HypeSDK(
  new PublicKey('your-program-id'),
  1,
  'https://api.mainnet-beta.solana.com'
)
```
#
#### initRoot

```typescript
async initRoot(): Promise<void>
```

**Description:**
Initializes the root account data. This method must be called before using other SDK methods.

**Returns:**
A Promise that resolves when the root account is successfully initialized.

**Throws:**
Error if initialization fails.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'

const sdk = new HypeSDK()

async function initialize() {
  try {
    await sdk.initRoot()
    console.log('Root account initialized successfully')
    // Now you can use other SDK methods
  } catch (error) {
    console.error('Failed to initialize root account:', error)
  }
}

initialize()
```
#
#### printFullRoot

```typescript
async printFullRoot(): Promise<void>
```

**Description:**
Initializes and returns the full root account data. This method provides more detailed information about the root account than `initRoot()`.

**Returns:**
A Promise that resolves with the full root account data.

**Throws:**
Error if initialization fails.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'

const sdk = new HypeSDK()

async function printRoot() {
  try {
    const rootData = await sdk.printFullRoot()
    console.log('Full root account data:', rootData)
  } catch (error) {
    console.error('Failed to get full root account data:', error)
  }
}

printRoot()
```
#
### User Methods

#### getUserTokens

```typescript
getUserTokens(publicKey: PublicKey): Promise<UserToken[]>
```

| Parameter   | Type        | Description           |
| ----------- | ----------- | --------------------- |
| `publicKey` | `PublicKey` | The user's public key |

**Description:**
Gets all tokens owned by a user.

**Returns:**
Promise resolving to an array of user tokens.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

const userPublicKey = new PublicKey('user-wallet-address')
const userTokens = await sdk.getUserTokens(userPublicKey)

console.log('User tokens:', userTokens)
// Example output:
// [
//   {
//     mint: PublicKey,
//     name: "TokenName",
//     symbol: "TKN",
//     supply: BigNumber,
//     balance: BigNumber,
//     price: BigNumber,
//     socialNetwork: 1
//   },
//   ...
// ]
```
#
#### getUserBalance

```typescript
getUserBalance(publicKey: PublicKey): Promise<Balance>
```

| Parameter   | Type        | Description           |
| ----------- | ----------- | --------------------- |
| `publicKey` | `PublicKey` | The user's public key |

**Description:**
Gets the balance of a user in SOL and USDC.

**Returns:**
Promise resolving to the user's balance object with `sol` and `usdc` properties as BigNumber values.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

const userPublicKey = new PublicKey('user-wallet-address')
const balance = await sdk.getUserBalance(userPublicKey)

console.log(`SOL Balance: ${balance.sol.toString()}`)
console.log(`USDC Balance: ${balance.usdc.toString()}`)
```
#
#### getUserPortfolio

```typescript
getUserPortfolio(publicKey: PublicKey): Promise<Portfolio>
```

| Parameter   | Type        | Description           |
| ----------- | ----------- | --------------------- |
| `publicKey` | `PublicKey` | The user's public key |

**Description:**
Gets the complete portfolio of a user including tokens and transaction history.

**Returns:**
Promise resolving to the user's portfolio data, which includes token holdings and their transaction history.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

const userPublicKey = new PublicKey('user-wallet-address')
const portfolio = await sdk.getUserPortfolio(userPublicKey)

console.log('User portfolio:', portfolio)
// Process portfolio data
portfolio.forEach((item) => {
  console.log(`Token: ${item.name}`)
  console.log(`Balance: ${item.balance.toString()}`)
  console.log('Transaction history:')
  item.history.forEach((tx) => {
    console.log(`  ${tx.type} - ${tx.committedAt}`)
  })
})
```
#
#### getUserReferrals

```typescript
getUserReferrals(publicKey: PublicKey): Promise<UserReferrals>
```

| Parameter   | Type        | Description           |
| ----------- | ----------- | --------------------- |
| `publicKey` | `PublicKey` | The user's public key |

**Description:**
Gets the referrals of a user, including earnings, count, and volume.

**Returns:**
Promise resolving to the user's referrals data with `earnings`, `count`, and `volume` properties.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

const userPublicKey = new PublicKey('user-wallet-address')
const referrals = await sdk.getUserReferrals(userPublicKey)

console.log(`Referral Earnings: ${referrals.earnings}`)
console.log(`Referral Count: ${referrals.count}`)
console.log(`Total Volume: ${referrals.volume}`)
```
#
### Token Methods

#### getTokenList

```typescript
getTokenList(params?: TokensListParams): Promise<ShortToken[]>
```

| Parameter | Type               | Description                                                               |
| --------- | ------------------ | ------------------------------------------------------------------------- |
| `params`  | `TokensListParams` | Optional parameters for filtering, sorting, and paginating the token list |

**Description:**
Gets a list of tokens with optional filtering, sorting, and pagination.

**Returns:**
Promise resolving to an array of tokens.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'

const sdk = new HypeSDK()
await sdk.initRoot()

// Get all tokens
const allTokens = await sdk.getTokenList()

// Get tokens with filtering, sorting, and pagination
const filteredTokens = await sdk.getTokenList({
  filters: [
    {
      field: 'price',
      filters: { gt: 0.2, lt: 0.5 },
    },
  ],
  sort: {
    field: 'supply',
    direction: 'desc',
  },
  pagination: {
    limit: 10,
    offset: 0,
  },
})

console.log('Filtered tokens:', filteredTokens)
```
#
#### getTokenLastTransaction

```typescript
getTokenLastTransaction(mint: PublicKey): Promise<TransactionHistoryItem>
```

| Parameter | Type        | Description                   |
| --------- | ----------- | ----------------------------- |
| `mint`    | `PublicKey` | The mint address of the token |

**Description:**
Gets the last transaction for a specific token.

**Returns:**
Promise resolving to the last transaction data.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

const tokenMint = new PublicKey('token-mint-address')
const lastTransaction = await sdk.getTokenLastTransaction(tokenMint)

console.log('Last transaction:', lastTransaction)
console.log(`Transaction type: ${lastTransaction.type}`)
console.log(`Transaction time: ${lastTransaction.committedAt}`)
```
#
### Transaction Building Methods

#### buildMintTxnIx

```typescript
buildMintTxnIx(
  token: ShortToken,
  client: ShortClient,
  tradeArgs: TradeArgs
): Promise<TransactionInstruction>
```

| Parameter   | Type          | Description                                       |
| ----------- | ------------- | ------------------------------------------------- |
| `token`     | `ShortToken`  | The token to mint                                 |
| `client`    | `ShortClient` | The client account data                           |
| `tradeArgs` | `TradeArgs`   | The trade arguments including amount and slippage |

**Description:**
Builds a transaction instruction for minting tokens.

**Returns:**
Promise resolving to the transaction instruction.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

// Get token and client data
const userTokens = await sdk.getUserTokens(userPublicKey)
const token = userTokens[0]
const client = {
  /* client data */
}

// Build mint transaction instruction
const mintIx = await sdk.buildMintTxnIx(token, client, {
  amount: 100,
  slippagePercent: 1,
})

// Use the instruction in a transaction
const transaction = await sdk.buildTradeTxn(mintIx, {
  units: 200000,
  unitPrice: 1,
})
```
#
#### buildBurnTxnIx

```typescript
buildBurnTxnIx(
  token: ShortToken,
  client: ShortClient,
  tradeArgs: TradeArgs
): Promise<TransactionInstruction>
```

| Parameter   | Type          | Description                                       |
| ----------- | ------------- | ------------------------------------------------- |
| `token`     | `ShortToken`  | The token to burn                                 |
| `client`    | `ShortClient` | The client account data                           |
| `tradeArgs` | `TradeArgs`   | The trade arguments including amount and slippage |

**Description:**
Builds a transaction instruction for burning tokens.

**Returns:**
Promise resolving to the transaction instruction.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

// Get token and client data
const userTokens = await sdk.getUserTokens(userPublicKey)
const token = userTokens[0]
const client = {
  /* client data */
}

// Build burn transaction instruction
const burnIx = await sdk.buildBurnTxnIx(token, client, {
  amount: 50,
  slippagePercent: 1,
})

// Use the instruction in a transaction
const transaction = await sdk.buildTradeTxn(burnIx, {
  units: 200000,
  unitPrice: 1,
})
```
#
#### buildCreatexnIx

```typescript
buildCreatexnIx(
  token: ShortToken,
  client: ShortClient,
  tradeArgs: TradeArgs
): Promise<TransactionInstruction>
```

| Parameter   | Type          | Description             |
| ----------- | ------------- | ----------------------- |
| `token`     | `ShortToken`  | The token to create     |
| `client`    | `ShortClient` | The client account data |
| `tradeArgs` | `TradeArgs`   | The trade arguments     |

**Description:**
Builds a transaction instruction for creating tokens.

**Returns:**
Promise resolving to the transaction instruction.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

// Get token and client data
const token = {
  /* token data */
}
const client = {
  /* client data */
}

// Build create transaction instruction
const createIx = await sdk.buildCreatexnIx(token, client, {
  amount: 1000,
})

// Use the instruction in a transaction
const transaction = await sdk.buildTradeTxn(createIx, {
  units: 300000,
  unitPrice: 1,
})
```
#
#### buildTradeTxn

```typescript
buildTradeTxn(
  ix: TransactionInstruction,
  computeBudgetSettings: ComputeBudgetSettings
): Promise<Transaction>
```

| Parameter               | Type                     | Description                 |
| ----------------------- | ------------------------ | --------------------------- |
| `ix`                    | `TransactionInstruction` | The transaction instruction |
| `computeBudgetSettings` | `ComputeBudgetSettings`  | The compute budget settings |

**Description:**
Builds a complete trade transaction from a transaction instruction.

**Returns:**
Promise resolving to the complete transaction.

**Throws:**
Error if root is not initialized.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

// Get token and client data
const userTokens = await sdk.getUserTokens(userPublicKey)
const token = userTokens[0]
const client = {
  /* client data */
}

// Build mint transaction instruction
const mintIx = await sdk.buildMintTxnIx(token, client, {
  amount: 100,
  slippagePercent: 1,
})

// Build the complete transaction
const transaction = await sdk.buildTradeTxn(mintIx, {
  units: 200000,
  unitPrice: 1,
})

// The transaction can now be signed and sent to the network
```
#
### Transaction Listener Methods

#### initTransactionListener

```typescript
async initTransactionListener(config: TransactionListenerConfig): Promise<void>
```

| Parameter | Type                        | Description                                |
| --------- | --------------------------- | ------------------------------------------ |
| `config`  | `TransactionListenerConfig` | Configuration for the transaction listener |

**Description:**
Initializes the transaction listener with the specified configuration.

**Returns:**
Promise that resolves when the listener is started.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

const sdk = new HypeSDK()
await sdk.initRoot()

// Initialize transaction listener
await sdk.initTransactionListener({
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  programPublicKey: 'your-program-id',
  onTransaction: (transaction) => {
    console.log('New transaction detected:', transaction)

    // Handle different transaction types
    switch (transaction.type) {
      case 'mint':
        console.log(`Mint transaction for token ${transaction.token}`)
        break
      case 'burn':
        console.log(`Burn transaction for token ${transaction.token}`)
        break
      case 'newtoken':
        console.log(`New token created: ${transaction.token}`)
        break
    }
  },
})

console.log('Transaction listener initialized')
```
#
#### stopTransactionListener

```typescript
stopTransactionListener(): void
```

**Description:**
Stops the transaction listener.

**Example:**

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'

const sdk = new HypeSDK()
await sdk.initRoot()

// Initialize transaction listener
await sdk.initTransactionListener({
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  programPublicKey: 'your-program-id',
  onTransaction: (transaction) => {
    console.log('New transaction:', transaction)
  },
})

// Later, when you want to stop listening
sdk.stopTransactionListener()
console.log('Transaction listener stopped')
```

## Data Types

### TradeArgs

```typescript
type TradeArgs = {
  amount: number
  slippagePercent?: number
}
```

Parameters for trading operations.

### ComputeBudgetSettings

```typescript
type ComputeBudgetSettings = {
  units: number
  unitPrice: number
}
```

Compute budget settings for transactions.

### TokensListParams

```typescript
type TokensListParams = {
  filters?: TokensFilterParams
  sort?: TokensSortParams
  pagination?: TokensPaginationParams
}
```

Parameters for getting the token list.

### TokensFilterParams

```typescript
type TokensFilterParams = {
  field: FilterFields
  filters: NumFilters
}[]
```

Token filtering parameters.

### NumFilters

```typescript
type NumFilters = {
  lt?: BigNumber | number
  lte?: BigNumber | number
  gt?: BigNumber | number
  gte?: BigNumber | number
  eq?: BigNumber | number
}
```

Numeric filters for the token list.

### Balance

```typescript
type Balance = {
  usdc: BigNumber
  sol: BigNumber
}
```

User balance in USDC and SOL.

### TransactionListenerConfig

```typescript
interface TransactionListenerConfig {
  rpcUrl: string
  programPublicKey: string
  commitment?: Commitment
  onTransaction: (transaction: ParsedTransaction) => void
}
```

Configuration for the transaction listener.

### ParsedTransaction

```typescript
interface ParsedTransaction {
  id: string
  tokenId: string
  orderId: string
  token: string
  creator: string
  wallet: string
  address: string
  networkId: number
  type: 'mint' | 'burn' | 'newtoken' | 'instruction'
  committedAt: string
  createdAt: string
  supply: number
  supplyDelta: number
  baseCrncyAmount: number
}
```

Structured transaction data with details about token operations.

## Transaction Types Comparison

| Feature              | Mint Transaction          | Burn Transaction               | Create Transaction             |
| -------------------- | ------------------------- | ------------------------------ | ------------------------------ |
| **Purpose**          | Add tokens to circulation | Remove tokens from circulation | Create new token               |
| **Effect on Supply** | Increases supply          | Decreases supply               | Initializes supply             |
| **Price Impact**     | Increases token price     | Decreases token price          | Sets initial price             |
| **Required Data**    | Token, client, amount     | Token, client, amount          | Token metadata, client, amount |
| **Return Value**     | Transaction instruction   | Transaction instruction        | Transaction instruction        |
| **Common Use Cases** | Investing in tokens       | Taking profits                 | Creating new social tokens     |

## Usage Examples

### Retrieving User Tokens and Balance

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

async function getUserAssets() {
  const sdk = new HypeSDK()
  await sdk.initRoot()

  const userPublicKey = new PublicKey('user-wallet-address')

  // Get user tokens
  const tokens = await sdk.getUserTokens(userPublicKey)
  console.log('User tokens:', tokens)

  // Get user balance
  const balance = await sdk.getUserBalance(userPublicKey)
  console.log(`SOL Balance: ${balance.sol.toString()}`)
  console.log(`USDC Balance: ${balance.usdc.toString()}`)

  // Get complete portfolio with transaction history
  const portfolio = await sdk.getUserPortfolio(userPublicKey)

  // Display portfolio information
  portfolio.forEach((item) => {
    console.log(`\nToken: ${item.name}`)
    console.log(`Symbol: ${item.symbol}`)
    console.log(`Balance: ${item.balance.toString()}`)
    console.log(`Price: ${item.price.toString()}`)

    console.log('Transaction history:')
    item.history.forEach((tx) => {
      console.log(
        `  ${tx.type} - Amount: ${tx.supplyDelta} - Date: ${new Date(
          tx.committedAt
        ).toLocaleString()}`
      )
    })
  })
}

getUserAssets()
```

### Filtering and Sorting Token List

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'

async function exploreTokens() {
  const sdk = new HypeSDK()
  await sdk.initRoot()

  // Get all tokens
  const allTokens = await sdk.getTokenList()
  console.log(`Total tokens available: ${allTokens.length}`)

  // Get tokens with price between 0.1 and 1.0, sorted by supply in descending order
  const filteredTokens = await sdk.getTokenList({
    filters: [
      {
        field: 'price',
        filters: { gte: 0.1, lte: 1.0 },
      },
    ],
    sort: {
      field: 'supply',
      direction: 'desc',
    },
    pagination: {
      limit: 10,
      offset: 0,
    },
  })

  console.log(`Found ${filteredTokens.length} tokens matching criteria`)

  // Display filtered tokens
  console.log('Top 10 tokens by supply (price between 0.1 and 1.0):')
  filteredTokens.forEach((token, index) => {
    console.log(`${index + 1}. ${token.name} (${token.symbol})`)
    console.log(`   Price: ${token.price.toString()}`)
    console.log(`   Supply: ${token.supply.toString()}`)
    console.log(`   Social Network: ${token.socialNetwork}`)
  })
}

exploreTokens()
```

### Setting Up a Transaction Listener

```typescript
import { HypeSDK } from '@hypewatch/hype-sdk'
import { PublicKey } from '@solana/web3.js'

async function monitorTransactions() {
  // Initialize SDK
  const sdk = new HypeSDK()
  await sdk.initRoot()

  console.log('Setting up transaction listener...')

  // Initialize transaction listener
  await sdk.initTransactionListener({
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    programPublicKey: sdk.programId.toString(),
    onTransaction: (transaction) => {
      // Log all transactions
      console.log('\nNew transaction detected:')
      console.log(`ID: ${transaction.id}`)
      console.log(`Token: ${transaction.token}`)
      console.log(`Type: ${transaction.type}`)
      console.log(`Time: ${new Date(transaction.committedAt).toLocaleString()}`)

      // Handle different transaction types
      switch (transaction.type) {
        case 'mint':
          console.log(
            `Mint transaction: ${transaction.supplyDelta} tokens minted`
          )
          console.log(`New supply: ${transaction.supply}`)
          console.log(`Base currency amount: ${transaction.baseCrncyAmount}`)
          break

        case 'burn':
          console.log(
            `Burn transaction: ${Math.abs(
              transaction.supplyDelta
            )} tokens burned`
          )
          console.log(`New supply: ${transaction.supply}`)
          console.log(`Base currency amount: ${transaction.baseCrncyAmount}`)
          break

        case 'newtoken':
          console.log(`New token created: ${transaction.token}`)
          console.log(`Creator: ${transaction.creator}`)
          console.log(`Network ID: ${transaction.networkId}`)
          break
      }
    },
  })

  console.log('Transaction listener initialized and running')
  console.log('Monitoring for new transactions...')
}

monitorTransactions()
```

## Troubleshooting

### Common Issues and Solutions

#### Root Initialization Failure

**Issue**: Error when calling `initRoot()` method.

**Solution**:

- Verify your RPC URL is correct and the node is responsive
- Check that you're using the correct program ID for the Hype Protocol
- Ensure you have a stable internet connection
- Try increasing the commitment level for more reliable responses

#### Transaction Building Errors

**Issue**: Errors when building transaction instructions.

**Solution**:

- Make sure the root is initialized before calling transaction methods
- Verify that token and client data are valid and complete
- Check that trade arguments are within acceptable ranges
- Ensure you have sufficient SOL for transaction fees

#### Transaction Listener Issues

**Issue**: Transaction listener not receiving events.

**Solution**:

- Verify the RPC URL supports WebSocket connections
- Check that the program ID is correct
- Ensure the commitment level is appropriate for your use case
- Try restarting the listener if it stops receiving events

### SDK Method Response Times

| Method             | Typical Response Time | Factors Affecting Performance              |
| ------------------ | --------------------- | ------------------------------------------ |
| `initRoot`         | 500-1000ms            | RPC node performance, network congestion   |
| `getUserTokens`    | 1000-2000ms           | Number of tokens, RPC performance          |
| `getUserBalance`   | 300-500ms             | RPC performance, network congestion        |
| `getUserPortfolio` | 1000-2500ms           | Number of tokens, transaction history size |
| `getTokenList`     | 1000-2000ms           | Filter complexity, number of tokens        |
| `buildTradeTxn`    | 100-300ms             | Transaction complexity, compute budget     |

## Development

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/hypewatch/hype-sdk.git
cd hype-sdk
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Run tests:

```bash
npm test
```

5. Run linter:

```bash
npm run lint
```

6. Run playground:

```bash
npm run playground
```

## License

MIT
