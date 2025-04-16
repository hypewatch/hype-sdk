import { PublicKey } from '@solana/web3.js'
import { NetworkRecord } from '../network-record'

export enum RootAccountOffsets {
	Tag = 0,
	Version = 4,
	Admin = 8,
	FeeWallet = 40,
	BaseCrncyMint = 72,
	BaseCrncyProgramAddress = 104,
	ClientsCount = 136,
	TokensCount = 144,
	Fees = 152,
	NetworksCount = 160,
	BaseCrncyDecsFactor = 164,
	Slot = 168,
	Time = 176,
	Decimals = 180,
	Supply = 184,
	Tvl = 192,
	Counter = 200,
	AllTimeBaseCrncyVolume = 208,
	AllTimeTokensVolume = 224,
	HolderFees = 240,
	InitPrice = 248,
	MaxSupply = 256,
	FeeRatio = 264,
	FeeRate = 272,
	CreationFee = 280,
	MaxNetworksCount = 288,
	CreationTime = 292,
	MinFees = 296,
	OperatorName = 304,
	RefDuration = 336,
	Mask = 340,
	RefDiscount = 344,
	RefRatio = 352,
	UrlPrefix = 360,
	NetworkRecords = 392,
}

export type ShortRoot = {
	address: PublicKey
	baseCrncyDecsFactor: number
	maxSupply: number
	initPrice: number
	feeRate: number
	minFees: number
	networks: NetworkRecord[]
	baseCrncyMint: PublicKey
	baseCrncyProgramAddress: PublicKey
}

export type FullRoot = {
	address: PublicKey
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
}
