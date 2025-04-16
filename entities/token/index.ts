import { PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { getString, readPubKey } from '../../lib/buf-utils'
import { calculateTokenPrice } from '../../lib/calculations'
import { NetworkStringLength } from '../network-record'
import { ShortRoot } from '../root'
import { TokenAccountOffsets } from './offsets'

export * from './offsets'

/**
 * Represents the raw token account data as stored on-chain
 * This class handles the deserialization of token account data from a buffer
 */
export class TokenAccountData {
	/** Tag identifying the account type */
	tag: number
	/** Version of the account data structure */
	version: number
	/** Unique identifier for the token account */
	id: number
	/** Public key of the token's mint account */
	mint: PublicKey
	/** Public key of the token program that owns this account */
	programAddress: PublicKey
	/** Public key of the account that created this token */
	creator: PublicKey
	/** Timestamp when the token was created */
	creationTime: Date
	/** Last update timestamp */
	time: Date
	/** Current token supply */
	supply: number
	/** Token's network address */
	address: string
	/** Network identifier */
	network: number
	/** Slot number of the last update */
	slot: number
	/** Total number of trades for this token */
	allTimeTradesCount: number
	/** Total volume in base currency */
	allTimeBaseCrncyVolume: number
	/** Total volume in token units */
	allTimeTokensVolume: number
	/** Validation status */
	validation: number

	/**
	 * Creates a new TokenAccountData instance from a buffer
	 * @param buf - The buffer containing the account data
	 * @param root - The root account data for calculations
	 */
	constructor(buf: Buffer, root: ShortRoot) {
		this.tag = buf.readUint32LE(TokenAccountOffsets.Tag)
		this.version = buf.readUint32LE(TokenAccountOffsets.Version)
		this.id = Number(buf.readBigInt64LE(TokenAccountOffsets.Id))
		this.mint = readPubKey(buf, TokenAccountOffsets.Mint)
		this.programAddress = readPubKey(buf, TokenAccountOffsets.ProgramAddress)
		this.creator = readPubKey(buf, TokenAccountOffsets.Creator)
		this.creationTime = new Date(
			buf.readUint32LE(TokenAccountOffsets.CreationTime) * 1000,
		)
		this.time = new Date(buf.readUint32LE(TokenAccountOffsets.Time) * 1000)
		this.supply =
			Number(buf.readBigInt64LE(TokenAccountOffsets.Supply)) /
			root.baseCrncyDecsFactor
		this.address = getString(
			buf,
			TokenAccountOffsets.Address,
			NetworkStringLength,
		)
		this.slot = Number(buf.readBigInt64LE(TokenAccountOffsets.Slot))
		this.network = buf.readUint32LE(TokenAccountOffsets.Network)
		this.allTimeBaseCrncyVolume =
			Number(buf.readBigInt64LE(TokenAccountOffsets.AllTimeBaseCrncyVolume)) /
			root.baseCrncyDecsFactor
		this.allTimeTokensVolume =
			Number(buf.readBigInt64LE(TokenAccountOffsets.AllTimeTokensVolume)) /
			root.baseCrncyDecsFactor
		this.allTimeTradesCount = Number(
			buf.readBigInt64LE(TokenAccountOffsets.AllTimeTradesCount),
		)
		this.validation = buf.readUint32LE(TokenAccountOffsets.Validation)
	}
}

/**
 * Represents a simplified token data structure used in the SDK
 * This class provides a more convenient interface for working with token data
 */
export class ShortToken {
	/** Public key of the token's mint account */
	mint: PublicKey
	/** Public key of the token program */
	tokenProgramId: PublicKey
	/** Token's network address */
	address: string
	/** Network identifier */
	networkId: number
	/** Network descriptor string */
	network: string
	/** Current token price */
	price: BigNumber
	/** Current token supply */
	supply: number
	/** Token creation timestamp */
	creationTime: Date

	/**
	 * Creates a new ShortToken instance from TokenAccountData
	 * @param tad - The raw token account data
	 * @param root - The root account data for calculations
	 */
	constructor(tad: TokenAccountData, root: ShortRoot) {
		this.mint = tad.mint
		this.tokenProgramId = tad.programAddress
		this.address = tad.address
		this.networkId = tad.network
		this.network = root.networks[tad.network].descriptor
		this.supply = tad.supply
		this.price = calculateTokenPrice(tad.supply, root)
		this.creationTime = tad.creationTime
	}
}

/**
 * Represents a token with its user-specific balance
 * This type extends ShortToken with balance information
 */
export type UserToken = ShortToken & { balance: BigNumber }
