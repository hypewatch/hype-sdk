import { PublicKey } from '@solana/web3.js'
import { HypeSDK } from './sdk'
import {
	ParsedTransaction,
	TransactionListenerConfig,
} from './sdk/transaction-listener'

async function main() {
	try {
		// Initialize SDK
		console.log('Initializing SDK...')
		const sdk = new HypeSDK()

		// Initialize root
		console.log('Initializing root...')
		await sdk.initRoot()

		console.log('Printing full root...')
		const fullRoot = await sdk.printFullRoot()
		console.log(fullRoot)

		// Test wallet address
		const walletAddress = 'G1XZNbpX2GoPHPEV71JrNvRicRnTYzjmrJfXQdbUnhoZ'
		const publicKey = new PublicKey(walletAddress)

		// Get user tokens
		console.log('\nGetting user tokens...')
		const tokens = await sdk.getUserTokens(publicKey)
		console.log('User tokens:', JSON.stringify(tokens, null, 2))

		// Get user referrals
		console.log('\nGetting user referrals...')
		const referrals = await sdk.getUserReferrals(publicKey)
		console.log('User referrals:', JSON.stringify(referrals, null, 2))

		// Get user balance
		console.log('\nGetting user balance...')
		const balance = await sdk.getUserBalance(publicKey)
		console.log('User balance:', JSON.stringify(balance, null, 2))

		// Get token list with filters
		console.log('\nGetting token list with filters...')
		const tokenList = await sdk.getTokenList({
			filters: [
				{
					field: 'networkId',
					filters: {
						eq: 1,
					},
				},
				{
					field: 'supply',
					filters: {
						lte: 1000,
						gte: 500,
					},
				},
			],
		})
		console.log('Filtered token list:', JSON.stringify(tokenList, null, 2))

		// Get token last transaction
		if (tokens.length > 0) {
			const firstToken = tokens[0]
			console.log('\nGetting last transaction for token:', firstToken.mint)
			const lastTx = await sdk.getTokenLastTransaction(
				new PublicKey(firstToken.mint),
			)
			console.log('Last transaction:', JSON.stringify(lastTx, null, 2))
		}

		// Get user portfolio
		console.log('\nGetting user portfolio...')
		const portfolio = await sdk.getUserPortfolio(publicKey)
		console.log('User portfolio:', JSON.stringify(portfolio, null, 2))

		// Test transaction listener
		console.log('\nTesting transaction listener...')
		const listenerConfig: TransactionListenerConfig = {
			rpcUrl: 'https://rpc-mainnet.hype.vote',
			programPublicKey: sdk.programId.toBase58(),
			onTransaction: (transaction: ParsedTransaction) => {
				console.log('\n=== New Transaction Detected ===')
				console.log('Transaction ID:', transaction.id)
				console.log('Type:', transaction.type)
				console.log('Token:', transaction.token)
				console.log('Address:', transaction.address)
				console.log('Network ID:', transaction.networkId)
				if (transaction.supply !== undefined) {
					console.log('Supply:', transaction.supply)
					console.log('Supply Delta:', transaction.supplyDelta)
					console.log('Base Currency Amount:', transaction.baseCrncyAmount)
				}
				console.log('Committed At:', transaction.committedAt)
				console.log('Created At:', transaction.createdAt)
				console.log('================================\n')
			},
		}

		await sdk.initTransactionListener(listenerConfig)

		// Keep the process running
		console.log('Transaction listener is running. Press Ctrl+C to stop.')

		// Handle process termination
		process.on('SIGINT', () => {
			console.log('\nStopping transaction listener...')
			sdk.stopTransactionListener()
			process.exit(0)
		})
	} catch (error) {
		console.error('Error:', error)
	}
}

// Run playground
main()
