import { Keypair } from '@solana/web3.js'

/**
 * Arguments for trade operations
 */
export type TradeArgs = {
	/** Amount of tokens to trade */
	amount: number
	/** Maximum allowed slippage percentage */
	slippagePercent?: number
	customPk?: Keypair
}

/**
 * Settings for compute budget allocation in transactions
 */
export type ComputeBudgetSettings = {
	/** Number of compute units to allocate */
	units: number
	/** Price per compute unit in microLamports */
	unitPrice: number
}
