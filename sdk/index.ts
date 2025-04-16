import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { ShortClient } from '../entities/client'
import { ShortRoot, getFullRoot, getRoot } from '../entities/root'
import { ShortToken } from '../entities/token'
import {
	DEFAULT_PROGRAM_ID,
	DEFAULT_RPC_URL,
	DEFAULT_VERSION,
} from '../lib/defaults'
import { TokensListParams } from '../lib/token-list-params'
import { TradeArgs } from './build-trade-txn'
import {
	ComputeBudgetSettings,
	buildTradeTxn,
	burn,
	mint,
} from './build-trade-txn'
import { create } from './build-trade-txn/create'
import { getTokenLastTransaction } from './get-token-last-transactions'
import { getTokenList } from './get-token-list'
import { getUserBalance } from './get-user-balance'
import { getUserPortfolio } from './get-user-portfolio'
import { getUserReferrals } from './get-user-referrals'
import { getUserTokens } from './get-user-tokens'
import {
	TransactionListener,
	TransactionListenerConfig,
} from './transaction-listener'

export type {
	TransactionListenerConfig,
	ParsedTransaction,
} from './transaction-listener'

export {
	TransactionListener,
	MINT_TYPE,
	BURN_TYPE,
	NEWTOKEN_TYPE,
	INSTRUCTION_TYPE,
	EVENT_MAP,
} from './transaction-listener'

/**
 * HypeSDK - SDK for interacting with the Hype Protocol
 *
 * This class provides methods to interact with the Hype Protocol on Solana.
 * It handles token operations, user balances, and trading functionality.
 *
 * @example
 * ```typescript
 * const sdk = new HypeSDK();
 * await sdk.initRoot();
 * const tokens = await sdk.getUserTokens(publicKey);
 * ```
 */
export class HypeSDK {
	/** The program ID of the Hype Protocol */
	programId: PublicKey
	/** The version of the protocol being used */
	version: number
	/** The Solana connection instance */
	connection: Connection
	/** The root account data */
	root: ShortRoot | undefined
	/** Transaction listener instance */
	private transactionListener: TransactionListener | null = null

	/**
	 * Creates a new instance of HypeSDK
	 * @param programId - The program ID of the Hype Protocol (defaults to DEFAULT_PROGRAM_ID)
	 * @param version - The version of the protocol (defaults to DEFAULT_VERSION)
	 * @param rpcURL - The Solana RPC URL (defaults to DEFAULT_RPC_URL)
	 */
	constructor(
		programId: PublicKey = DEFAULT_PROGRAM_ID,
		version: number = DEFAULT_VERSION,
		rpcURL: string = DEFAULT_RPC_URL,
	) {
		this.programId = programId
		this.version = version
		this.connection = new Connection(rpcURL)
	}

	/**
	 * Initializes the root account data
	 * This method must be called before using other SDK methods
	 * @throws {Error} If initialization fails
	 */
	async initRoot(this: HypeSDK) {
		this.root = await getRoot(this.programId, this.version, this.connection)
	}

	/**
	 * Initializes the full root account data
	 * This method must be called before using other SDK methods
	 * @throws {Error} If initialization fails
	 */
	async printFullRoot(this: HypeSDK) {
		return await getFullRoot(this.programId, this.version, this.connection)
	}

	/**
	 * Checks if root is initialized
	 * @throws {Error} If root is not initialized
	 */
	checkNoRootError(this: HypeSDK) {
		if (!this.root) throw Error('Init root first!')
	}

	/**
	 * Gets all tokens owned by a user
	 * @param publicKey - The user's public key
	 * @returns Promise resolving to an array of user tokens
	 * @throws {Error} If root is not initialized
	 */
	getUserTokens(this: HypeSDK, publicKey: PublicKey) {
		return getUserTokens(this, publicKey)
	}

	/**
	 * Gets the balance of a user
	 * @param publicKey - The user's public key
	 * @returns Promise resolving to the user's balance in SOL and USDC
	 * @throws {Error} If root is not initialized
	 */
	getUserBalance(this: HypeSDK, publicKey: PublicKey) {
		return getUserBalance(this, publicKey)
	}

	/**
	 * Gets the complete portfolio of a user including tokens and transaction history
	 * @param publicKey - The user's public key
	 * @returns Promise resolving to the user's portfolio data
	 * @throws {Error} If root is not initialized
	 */
	getUserPortfolio(this: HypeSDK, publicKey: PublicKey) {
		return getUserPortfolio(this, publicKey)
	}

	/**
	 * Gets the referrals of a user
	 * @param publicKey - The user's public key
	 * @returns Promise resolving to the user's referrals data
	 * @throws {Error} If root is not initialized
	 */
	getUserReferrals(this: HypeSDK, publicKey: PublicKey) {
		return getUserReferrals(this, publicKey)
	}

	/**
	 * Gets a list of tokens with optional filtering
	 * @param params - Optional parameters for filtering the token list
	 * @returns Promise resolving to an array of tokens
	 * @throws {Error} If root is not initialized
	 */
	getTokenList(this: HypeSDK, params?: TokensListParams) {
		return getTokenList(this, params)
	}

	/**
	 * Gets the last transaction for a specific token
	 * @param mint - The mint address of the token
	 * @returns Promise resolving to the last transaction data
	 * @throws {Error} If root is not initialized
	 */
	getTokenLastTransaction(this: HypeSDK, mint: PublicKey) {
		return getTokenLastTransaction(this, mint)
	}

	/**
	 * Builds a transaction instruction for minting tokens
	 * @param token - The token to mint
	 * @param client - The client account data
	 * @param tradeArgs - The trade arguments
	 * @returns Promise resolving to the transaction instruction
	 * @throws {Error} If root is not initialized
	 */
	buildMintTxnIx(
		this: HypeSDK,
		token: ShortToken,
		client: ShortClient,
		tradeArgs: TradeArgs,
	) {
		return mint(this, token, client, tradeArgs)
	}

	/**
	 * Builds a transaction instruction for burning tokens
	 * @param token - The token to burn
	 * @param client - The client account data
	 * @param tradeArgs - The trade arguments
	 * @returns Promise resolving to the transaction instruction
	 * @throws {Error} If root is not initialized
	 */
	buildBurnTxnIx(
		this: HypeSDK,
		token: ShortToken,
		client: ShortClient,
		tradeArgs: TradeArgs,
	) {
		return burn(this, token, client, tradeArgs)
	}

	/**
	 * Builds a transaction instruction for creating tokens
	 * @param token - The token to create
	 * @param client - The client account data
	 * @param tradeArgs - The trade arguments
	 * @returns Promise resolving to the transaction instruction
	 * @throws {Error} If root is not initialized
	 */
	buildCreatexnIx(
		this: HypeSDK,
		token: ShortToken,
		client: ShortClient,
		tradeArgs: TradeArgs,
	) {
		return create(this, token, client, tradeArgs)
	}

	/**
	 * Builds a complete trade transaction
	 * @param ix - The transaction instruction
	 * @param computeBudgetSettings - The compute budget settings
	 * @returns Promise resolving to the complete transaction
	 * @throws {Error} If root is not initialized
	 */
	buildTradeTxn(
		this: HypeSDK,
		ix: TransactionInstruction,
		computeBudgetSettings: ComputeBudgetSettings,
	) {
		return buildTradeTxn(this, ix, computeBudgetSettings)
	}

	/**
	 * Initialize transaction listener
	 * @param config Transaction listener configuration
	 * @returns Promise that resolves when the listener is started
	 */
	public async initTransactionListener(
		config: TransactionListenerConfig,
	): Promise<void> {
		if (this.transactionListener) {
			console.warn('Transaction listener is already initialized')
			return
		}

		this.transactionListener = new TransactionListener(config)
		await this.transactionListener.start(config.onTransaction)
	}

	/**
	 * Stop transaction listener
	 */
	public stopTransactionListener(): void {
		if (this.transactionListener) {
			this.transactionListener.stop()
			this.transactionListener = null
		}
	}
}
