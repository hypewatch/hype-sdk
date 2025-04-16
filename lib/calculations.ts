import BigNumber from 'bignumber.js'
import { ShortRoot } from '../entities/root'

export function calculateReserve(
	currentSupply: number | BigNumber,
	root: ShortRoot,
) {
	const bnCurrentSupply = BigNumber(currentSupply)
	return BigNumber(root.maxSupply)
		.multipliedBy(bnCurrentSupply)
		.multipliedBy(root.initPrice)
		.dividedBy(BigNumber(root.maxSupply).minus(bnCurrentSupply))
}
export const calculateTokenPrice = (
	currentSupply: number,
	root: ShortRoot,
	reserveParam?: number,
) => {
	const reserve =
		reserveParam === undefined
			? calculateReserve(currentSupply, root)
			: BigNumber(reserveParam)

	return reserve
		.plus(root.maxSupply * root.initPrice)
		.dividedBy(root.maxSupply - currentSupply)
}

export const calculateBurn = (
	supply: number | BigNumber,
	value: number | BigNumber,
	root: ShortRoot,
	log?: boolean,
) => {
	const bnSupply = BigNumber(supply)
	const bnValue = BigNumber(value)
	const S1 = BigNumber(supply)
	const S2 = BigNumber(bnSupply.minus(bnValue))

	const R1 = calculateReserve(S1, root)
	const R2 = calculateReserve(S2, root)
	const baseCashout = R1.minus(R2)

	if (log)
		console.log(
			`For calc check: Initial reserve: ${R1.toString()}, USDC return: ${baseCashout.toString()}`,
		)

	const fees = BigNumber.max(
		baseCashout.multipliedBy(root.feeRate),
		root.minFees,
	)
	return {
		cashout: baseCashout,
		fees,
		total: baseCashout.minus(fees),
	}
}

export const calculateMint = (
	supply: number | BigNumber,
	value: number | BigNumber,
	root: ShortRoot,
	log?: boolean,
) => {
	const bnSupply = BigNumber(supply)
	const bnValue = BigNumber(value)
	const S1 = BigNumber(supply)
	const S2 = BigNumber(bnSupply.plus(bnValue))

	const R2 = calculateReserve(S2, root)
	const R1 = calculateReserve(S1, root)
	const baseCost = R2.minus(R1)

	if (log)
		console.log(
			`For calc check: Initial reserve: ${R1.toString()}, USDC expenses: ${baseCost.toString()}`,
		)

	const fees = BigNumber.max(baseCost.multipliedBy(root.feeRate), root.minFees)
	return {
		cost: baseCost,
		fees,
		total: baseCost.plus(fees),
	}
}

// export const calculateMintReverse = (
// 	supply: number | BigNumber,
// 	usdcAmount: number | BigNumber,
// 	root: ShortRoot,
// 	log?: boolean,
// ) => {
// 	const bnSupply = BigNumber(supply)
// 	const bnUsdcAmount = BigNumber(usdcAmount)
// 	const M = BigNumber(root.maxSupply)
// 	const I = BigNumber(root.initPrice)

// 	const R1 = calculateReserve(bnSupply, root)

// 	const R2 = R1.plus(bnUsdcAmount)

// 	const S2 = R2.multipliedBy(M).dividedBy(M.multipliedBy(I).plus(R2))

// 	if (log)
// 		console.log(
// 			`For calc check: Initial reserve: ${R1.toString()}, Tokens minted: ${S2.minus(bnSupply).toString()}`,
// 		)

// 	return S2.minus(bnSupply)
// }

// export const calculateBurnReverse = (
// 	supply: number | BigNumber,
// 	usdcAmount: number | BigNumber,
// 	root: ShortRoot,
// 	log?: boolean,
// ) => {
// 	const bnSupply = BigNumber(supply)
// 	const bnUsdcAmount = BigNumber(usdcAmount)

// 	const R1 = calculateReserve(bnSupply, root)
// 	const R2 = R1.minus(bnUsdcAmount)

// 	const M = BigNumber(root.maxSupply)
// 	const I = BigNumber(root.initPrice)
// 	const S2 = R2.multipliedBy(M).dividedBy(M.multipliedBy(I).plus(R2))

// 	if (log)
// 		console.log(
// 			`For calc check: Initial reserve: ${R1.toString()}, Tokens burned: ${bnSupply.minus(S2).toString()}`,
// 		)

// 	return bnSupply.minus(S2)
// }
