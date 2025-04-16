import { PublicKey } from '@solana/web3.js'
import { HypeSDK } from '.'
import { getTokenReports } from '../entities/report'
import { TransactionHistoryItem } from '../entities/transaction-history'

export const getTokenLastTransaction = async (
	ctx: HypeSDK,
	mint: PublicKey,
) => {
	ctx.checkNoRootError()
	const reports = await getTokenReports(mint, ctx.root!, ctx.connection)
	console.log(new TransactionHistoryItem(reports[0], ctx.root!))
	return new TransactionHistoryItem(reports[0], ctx.root!)
	// not sure if it's allways [0], will leave like this until proven otherwise
}
