import { PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'

export enum Event {
	Error = 0,
	NewClient = 1,
	NewNetwork = 2,
	NewToken = 3,
	Mint = 4,
	Burn = 5,
}

/**
 * @property {number} orderId Event order ID
 * @property {number} clientId Client ID
 * @property {number} tokenId Token ID
 * @property {number} networkId Token ID
 * @property {PublicKey} mint Token mint
 * @property {PublicKey} creator Token creator public key
 * @property {string} address Token address
 * @property {number} supply Token supply
 * @property {Date} creationTime Creation time
 * @property {number} allTimeTradesCount Token all time trades count
 * @property {number} allTimeBaseCrncyVolume Token all time base currency volume
 * @property {number} allTimeTokensVolume Token all time tokensvolume
 * @property {number} baseCrncyAmount Trade's base currency amount
 * @property {number} tokenId Traded tokens amount
 * @property {Date} time Event time
 * @property {number} slot Event slot
 */
export interface MintOrBurnReport {
	event: Event.Mint | Event.Burn
	clientId: number
	orderId: number
	tokenId: number
	networkId: number
	mint: PublicKey
	creator: PublicKey
	wallet: PublicKey
	address: string
	nickname: string
	supply: number
	creationTime: Date
	allTimeTradesCount: number
	allTimeBaseCrncyVolume: number
	allTimeTokensVolume: number
	tokensAmount: number
	baseCrncyAmount: BigNumber
	time: Date
	slot: number
}
