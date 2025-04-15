import { PublicKey } from '@solana/web3.js'
import { HypeSDK } from './sdk'
// import { findClientAccountAddress } from './lib/contract-utils'
// import { ClientAccountData, ShortClient } from './entities/client'
// import { keypairFromPrivateKey } from './lib/keypair-from-private-key'
// import { PublicKey, sendAndConfirmTransaction } from '@solana/web3.js'
// import { getUserBalance } from './sdk/get-user-balance'

const sdk = new HypeSDK()
;(async () => {
	await sdk.initRoot()
	// const keypair = keypairFromPrivateKey('')
	// const clientAccAddress = findClientAccountAddress(
	// 	keypair.publicKey,
	// 	sdk.programId,
	// 	sdk.version,
	// )
	// const clientAccountInfo =
	// 	await sdk.connection.getAccountInfo(clientAccAddress)
	// const clientAccountData = new ClientAccountData(
	// 	clientAccountInfo!.data,
	// 	sdk.root!,
	// )
	// const client = new ShortClient(clientAccountData)
	// const userTokens = await sdk.getUserTokens(keypair.publicKey)

	// console.log(userTokens[1])
	// const txnIx = await sdk.buildBurnTxnIx(userTokens[1], client, {
	// 	amount: 1,
	// 	slippagePercent: 3,
	// })
	// const txnIx = await sdk.buildMintTxnIx(userTokens[1], client, {
	// 	amount: 1,
	// 	slippagePercent: 3,
	// })

	// const txn = await sdk.buildTradeTxn(txnIx, {
	// 	units: 50_000,
	// 	unitPrice: 20_000,
	// })

	// const tx = await sendAndConfirmTransaction(sdk.connection, txn, [keypair], {
	// 	maxRetries: 5,
	// 	skipPreflight: false,
	// })

	// console.log(tx)

	console.log(
		await sdk.getUserPortfolio(
			new PublicKey('GNK3Rk4P27PPS4hpwuiFbNkZQa5iiEtMdZV5CimjcKaz'),
		),
		// await sdk.getTokenList({
		// 	filters: [{ field: 'price', filters: { gte: 0.2, lte: 0.5 } }],
		// 	sort: { field: 'supply', direction: 'desc' },
		// 	pagination: { offset: 3, limit: 3 },
		// }),
	)
	// sdk.getTokenLastTransaction(
	// 	new PublicKey('125VbLSaMUFyMKtz92SstVR7RCTn4aZpydLanQkjhype'),
	// )
	// console.log(await sdk.getTokenList())
})()
