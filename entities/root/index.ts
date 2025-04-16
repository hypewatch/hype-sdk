import { Connection, PublicKey } from '@solana/web3.js'
import { getString, readPubKey } from '../../lib/buf-utils'
import { findHypeAuthorityAddress } from '../../lib/contract-utils'
import { AccountTags } from '../../lib/enums'
import { NetworkRecord, NetworkRecordLength } from '../network-record'
import { FullRoot, RootAccountOffsets, ShortRoot } from './offsets'

export * from './offsets'

export const findRootAccountAddress = (
	programId: PublicKey,
	version: number,
): PublicKey => {
	const buf = Buffer.alloc(8)
	buf.writeInt32LE(version, 0)
	buf.writeInt32LE(AccountTags.Root, 4)
	const hypeAuthorityAddress = findHypeAuthorityAddress(programId)
	const [rootAccount] = PublicKey.findProgramAddressSync(
		[buf, hypeAuthorityAddress.toBytes()],
		programId,
	)
	return rootAccount
}

/**
 * @property {number} tag Root Account Tag
 * @property {number} version Smart contract version
 * @property {PublicKey} admin Admin wallet address
 * @property {PublicKey} feeWallet Wallet address for fees withdrawing
 * @property {PublicKey} baseCrncyMint Base currency mint address
 * @property {PublicKey} baseCrncyProgramAddress Base currency program address
 * @property {number} clientsCount Total clients count
 * @property {number} tokensCount Total Hype tokens count
 * @property {number} fees Fees that available to withdraw
 * @property {number} networksCount Social betworks count
 * @property {number} baseCrncyDecsFactor Base currency decimal factor (1000000 for USDC)
 * @property {number} slot Last update slot
 * @property {Date} time Last update time
 * @property {number} decimals Base currency decimals
 * @property {number} supply Total Hype tokens supply
 * @property {number} tvl TVL in base currency
 * @property {number} allTimeBaseCrncyVolume All time traded volume in base currency
 * @property {number} allTimeTokensVolume All time traded volume in Hype tokens
 * @property {string[]} network Social networks descriptors array
 */
export class RootAccountData {
	tag: number
	version: number
	admin: PublicKey
	feeWallet: PublicKey
	baseCrncyMint: PublicKey
	baseCrncyProgramAddress: PublicKey
	clientsCount: number
	tokensCount: number
	fees: number
	networksCount: number
	baseCrncyDecsFactor: number
	slot: number
	time: Date
	decimals: number
	supply: number
	tvl: number
	counter: number
	allTimeBaseCrncyVolume: number
	allTimeTokensVolume: number
	holderFees: number
	initPrice: number
	maxSupply: number
	feeRatio: number
	feeRate: number
	creationFee: number
	maxNetworksCount: number
	creationTime: Date
	minFees: number
	networks: NetworkRecord[]
	operatorName: string
	refDuration: number
	mask: number
	refDiscount: number
	refRatio: number
	urlPrefix: string
	constructor(buf: Buffer) {
		this.tag = buf.readUint32LE(RootAccountOffsets.Tag)
		this.version = buf.readUint32LE(RootAccountOffsets.Version)
		this.admin = readPubKey(buf, RootAccountOffsets.Admin)
		this.feeWallet = readPubKey(buf, RootAccountOffsets.FeeWallet)
		this.baseCrncyMint = readPubKey(buf, RootAccountOffsets.BaseCrncyMint)
		this.baseCrncyProgramAddress = readPubKey(
			buf,
			RootAccountOffsets.BaseCrncyProgramAddress,
		)
		this.clientsCount = Number(
			buf.readBigInt64LE(RootAccountOffsets.ClientsCount),
		)
		this.tokensCount = Number(
			buf.readBigInt64LE(RootAccountOffsets.TokensCount),
		)
		this.baseCrncyDecsFactor = buf.readUint32LE(
			RootAccountOffsets.BaseCrncyDecsFactor,
		)
		this.fees =
			Number(buf.readBigInt64LE(RootAccountOffsets.Fees)) /
			this.baseCrncyDecsFactor
		this.networksCount = buf.readUint32LE(RootAccountOffsets.NetworksCount)
		this.slot = Number(buf.readBigInt64LE(RootAccountOffsets.Slot))
		this.time = new Date(buf.readUint32LE(RootAccountOffsets.Time) * 1000)
		this.decimals = buf.readUint32LE(RootAccountOffsets.Decimals)
		this.supply =
			Number(buf.readBigInt64LE(RootAccountOffsets.Supply)) /
			this.baseCrncyDecsFactor
		this.tvl =
			Number(buf.readBigInt64LE(RootAccountOffsets.Tvl)) /
			this.baseCrncyDecsFactor
		this.counter = Number(buf.readBigInt64LE(RootAccountOffsets.Counter))
		this.allTimeBaseCrncyVolume =
			Number(buf.readBigInt64LE(RootAccountOffsets.AllTimeBaseCrncyVolume)) /
			this.baseCrncyDecsFactor
		this.allTimeTokensVolume =
			Number(buf.readBigInt64LE(RootAccountOffsets.AllTimeTokensVolume)) /
			this.baseCrncyDecsFactor
		this.holderFees =
			Number(buf.readBigInt64LE(RootAccountOffsets.HolderFees)) /
			this.baseCrncyDecsFactor
		this.initPrice = buf.readDoubleLE(RootAccountOffsets.InitPrice)
		this.maxSupply =
			Number(buf.readBigInt64LE(RootAccountOffsets.MaxSupply)) /
			this.baseCrncyDecsFactor
		this.feeRatio = buf.readDoubleLE(RootAccountOffsets.FeeRatio)
		this.feeRate = buf.readDoubleLE(RootAccountOffsets.FeeRate)
		this.creationFee = buf.readDoubleLE(RootAccountOffsets.CreationFee)
		this.maxNetworksCount = buf.readUint32LE(
			RootAccountOffsets.MaxNetworksCount,
		)
		this.creationTime = new Date(
			buf.readUint32LE(RootAccountOffsets.CreationTime) * 1000,
		)
		this.minFees = buf.readDoubleLE(RootAccountOffsets.MinFees)
		this.operatorName = getString(buf, RootAccountOffsets.OperatorName, 24)
		this.refDuration = buf.readUint32LE(RootAccountOffsets.RefDuration)
		this.mask = buf.readUint32LE(RootAccountOffsets.Mask)
		this.refDiscount = buf.readDoubleLE(RootAccountOffsets.RefDiscount)
		this.refRatio = buf.readDoubleLE(RootAccountOffsets.RefRatio)
		this.urlPrefix = getString(buf, RootAccountOffsets.UrlPrefix, 32)
		this.networks = []
		for (let i = 0; i < this.networksCount; ++i) {
			const offset = RootAccountOffsets.NetworkRecords + NetworkRecordLength * i
			this.networks.push(new NetworkRecord(buf, offset))
		}
	}
}

export const getRoot = async (
	programId: PublicKey,
	version: number,
	connection: Connection,
): Promise<ShortRoot> => {
	const rootAccountAddress = findRootAccountAddress(programId, version)
	const rootAccountInfo = await connection.getAccountInfo(rootAccountAddress)
	if (!rootAccountInfo) {
		throw Error('No root account info found!')
	}
	const rootAccountData = new RootAccountData(rootAccountInfo?.data)
	return {
		address: rootAccountAddress,
		baseCrncyDecsFactor: rootAccountData.baseCrncyDecsFactor,
		maxSupply: rootAccountData.maxSupply,
		initPrice: rootAccountData.initPrice,
		feeRate: rootAccountData.feeRate,
		minFees: rootAccountData.minFees,
		networks: rootAccountData.networks,
		baseCrncyMint: rootAccountData.baseCrncyMint,
		baseCrncyProgramAddress: rootAccountData.baseCrncyProgramAddress,
	}
}

export const getFullRoot = async (
	programId: PublicKey,
	version: number,
	connection: Connection,
): Promise<FullRoot> => {
	const rootAccountAddress = findRootAccountAddress(programId, version)
	const rootAccountInfo = await connection.getAccountInfo(rootAccountAddress)
	if (!rootAccountInfo) {
		throw Error('No root account info found!')
	}
	const rootAccountData = new RootAccountData(rootAccountInfo?.data)
	return {
		address: rootAccountAddress,
		...rootAccountData,
	}
}
