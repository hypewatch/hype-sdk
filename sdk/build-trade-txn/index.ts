import {
	ComputeBudgetProgram,
	Transaction,
	TransactionInstruction,
} from '@solana/web3.js'
import { HypeSDK } from '..'
import { ComputeBudgetSettings } from './types'

export * from './mint'
export * from './burn'
export * from './types'

/**
 * Builds a complete trade transaction with compute budget settings
 * @param ctx - The HypeSDK instance
 * @param ix - The transaction instruction to include
 * @param computeBudgetSettings - Settings for compute budget allocation
 * @returns Promise resolving to a complete transaction
 */
export const buildTradeTxn = async (
	ctx: HypeSDK,
	ix: TransactionInstruction,
	computeBudgetSettings: ComputeBudgetSettings,
) => {
	const priorityFee = ComputeBudgetProgram.setComputeUnitPrice({
		microLamports: computeBudgetSettings.unitPrice,
	})

	const budget = ComputeBudgetProgram.setComputeUnitLimit({
		units: computeBudgetSettings.units,
	})

	const txn = new Transaction().add(ix, budget, priorityFee)
	const latestBlockhash = await ctx.connection.getLatestBlockhash()
	txn.recentBlockhash = latestBlockhash.blockhash

	return txn
}
