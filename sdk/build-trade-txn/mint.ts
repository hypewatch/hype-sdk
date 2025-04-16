import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_2022_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { SystemProgram, TransactionInstruction } from '@solana/web3.js'
import { HypeSDK } from '../'
import { NicknameStringLength, ShortClient } from '../../entities/client'
import { Event } from '../../entities/report'
import { ShortToken } from '../../entities/token'
import { calculateMint } from '../../lib/calculations'
import {
	findClientAccountAddress,
	findHypeAuthorityAddress,
	findTokenAccountAddress,
} from '../../lib/contract-utils'
import { TradeArgs } from './'

export const mint = async (
	ctx: HypeSDK,
	token: ShortToken,
	client: ShortClient,
	tradeArgs: TradeArgs,
) => {
	ctx.checkNoRootError()
	const { wallet } = client
	const hypeAuthority = findHypeAuthorityAddress(ctx.programId)
	const clientAccount = findClientAccountAddress(
		wallet,
		ctx.programId,
		ctx.version,
	)
	const aTokenAcc = getAssociatedTokenAddressSync(
		ctx.root!.baseCrncyMint,
		wallet,
	)

	const tokenMint = token.mint
	const tokenProgram = token.tokenProgramId

	const aHypeAcc = getAssociatedTokenAddressSync(
		tokenMint,
		wallet,
		false,
		TOKEN_2022_PROGRAM_ID,
	)
	const buf = Buffer.alloc(80)
	buf.writeUint8(Event.Mint, 0)
	buf.writeUint32LE(token.networkId, 4)
	buf.writeBigInt64LE(BigInt(tradeArgs.amount * 1000000), 8)
	if (client.nickname !== undefined) {
		buf.write(
			client.nickname,
			48,
			Math.min(NicknameStringLength, client.nickname.length),
			'utf-8',
		)
	}
	if (tradeArgs.slippagePercent && tradeArgs.slippagePercent > 0) {
		const { cost } = calculateMint(token.supply, tradeArgs.amount, ctx.root!)
		const limitBigInt = BigInt(
			cost
				.multipliedBy(1 + tradeArgs.slippagePercent / 100)
				.toFixed(6)
				.replace('.', ''),
		)
		buf.writeBigInt64LE(limitBigInt, 16)
	}
	buf.write(
		token.address.toLowerCase(),
		24,
		Math.min(NicknameStringLength, token.address.length),
		'utf-8',
	)
	const refWallet = client.refWallet
	// checking if refWallet === 1111111111...111
	const refAccount =
		refWallet.toString() === SystemProgram.programId.toString()
			? SystemProgram.programId
			: getAssociatedTokenAddressSync(
					ctx.root!.baseCrncyMint,
					client.refWallet,
					false,
					TOKEN_PROGRAM_ID,
				)

	const tokenAccount = findTokenAccountAddress(
		ctx.programId,
		token.networkId,
		token.address,
		ctx.version,
	)
	const ix = new TransactionInstruction({
		keys: [
			{ pubkey: wallet, isSigner: true, isWritable: true },
			{ pubkey: ctx.root!.address, isSigner: false, isWritable: true },
			{ pubkey: clientAccount, isSigner: false, isWritable: true },
			{ pubkey: aTokenAcc, isSigner: false, isWritable: true },
			{ pubkey: aHypeAcc, isSigner: false, isWritable: true },
			{ pubkey: tokenAccount, isSigner: false, isWritable: true },
			{ pubkey: ctx.root!.baseCrncyMint, isSigner: false, isWritable: false },
			{
				pubkey: ctx.root!.baseCrncyProgramAddress,
				isSigner: false,
				isWritable: true,
			},
			{
				pubkey: tokenMint,
				isSigner: false,
				isWritable: true,
			},
			{
				pubkey: tokenProgram,
				isSigner: false,
				isWritable: true,
			},
			{ pubkey: hypeAuthority, isSigner: false, isWritable: false },
			{ pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
			{ pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
			{ pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
			{
				pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
				isSigner: false,
				isWritable: false,
			},
			{ pubkey: refWallet, isSigner: false, isWritable: false },
			{ pubkey: refAccount, isSigner: false, isWritable: true },
		],
		programId: ctx.programId,
		data: buf,
	})
	return ix
}
