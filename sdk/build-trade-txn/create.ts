import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_2022_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import {
	Keypair,
	PublicKey,
	SystemProgram,
	TransactionInstruction,
} from '@solana/web3.js'
import { TradeArgs } from '.'
import { HypeSDK } from '..'
import { NicknameStringLength, ShortClient } from '../../entities/client'
import { ShortToken } from '../../entities/token'
import { calculateMint } from '../../lib/calculations'
import {
	findClientAccountAddress,
	findHypeAuthorityAddress,
	findTokenAccountAddress,
} from '../../lib/contract-utils'

export const create = async (
	ctx: HypeSDK,
	token: ShortToken,
	client: ShortClient,
	tradeArgs: TradeArgs,
) => {
	const hypeAuthority = findHypeAuthorityAddress(ctx.programId)
	const clientAccount = findClientAccountAddress(
		ctx.programId,
		client.wallet,
		ctx.version,
	)
	const aTokenAcc = getAssociatedTokenAddressSync(
		ctx.root?.baseCrncyMint!,
		client.wallet,
	)
	const tokenAccount = findTokenAccountAddress(
		ctx.programId,
		token.networkId,
		token.address,
		ctx.version,
	)
	const tokenMint: PublicKey | null = null
	const tokenMintKeypair: Keypair = tradeArgs.customPk || Keypair.generate()
	const tokenProgram: PublicKey | null = null
	const tokenProgramKeypair: Keypair = Keypair.generate()
	const signers = []
	signers.push(tokenMintKeypair)
	signers.push(tokenProgramKeypair)

	const aHypeAcc = getAssociatedTokenAddressSync(
		tokenMint == null ? tokenMintKeypair!.publicKey : tokenMint,
		client.wallet,
		false,
		TOKEN_2022_PROGRAM_ID,
	)

	const buf = Buffer.alloc(80)
	buf.writeUint8(4, 0)
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
	let refWallet: PublicKey
	let refAccount: PublicKey
	if (client.refWallet !== undefined) {
		refWallet = client.refWallet
		refAccount = getAssociatedTokenAddressSync(
			ctx.root?.baseCrncyMint!,
			client.refWallet,
			false,
			TOKEN_PROGRAM_ID,
		)
	} else {
		refWallet = SystemProgram.programId
		refAccount = SystemProgram.programId
	}
	const instruction = new TransactionInstruction({
		keys: [
			{ pubkey: client.wallet, isSigner: true, isWritable: true },
			{ pubkey: ctx.root!.address, isSigner: false, isWritable: true },
			{ pubkey: clientAccount, isSigner: false, isWritable: true },
			{ pubkey: aTokenAcc, isSigner: false, isWritable: true },
			{ pubkey: aHypeAcc, isSigner: false, isWritable: true },
			{ pubkey: tokenAccount, isSigner: false, isWritable: true },
			{ pubkey: ctx.root?.baseCrncyMint!, isSigner: false, isWritable: false },
			{
				pubkey: ctx.root!.baseCrncyProgramAddress,
				isSigner: false,
				isWritable: true,
			},
			{
				pubkey: tokenMint == null ? tokenMintKeypair!.publicKey : tokenMint,
				isSigner: tokenMint == null,
				isWritable: true,
			},
			{
				pubkey:
					tokenProgram == null ? tokenProgramKeypair!.publicKey : tokenProgram,
				isSigner: tokenProgram == null,
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
	return {
		instruction: instruction,
		signers: signers as Keypair[],
	}
}
