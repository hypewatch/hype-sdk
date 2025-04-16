import { AccountLayout, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
// import { getString, readPubKey } from '../lib/buf-utils'
// import { findHypeAuthorityAddress } from '../lib/find-hype-authority-address'
// import { TokenAccountData } from '../entities/token'
import BigNumber from 'bignumber.js'
// import bs58 from 'bs58'
import { HypeSDK } from '.'
import { ShortToken, TokenAccountData, UserToken } from '../entities/token'
import { getString, readPubKey } from '../lib/buf-utils'
import {
	findHypeAuthorityAddress,
	findTokenAccountAddress,
	getSocialNumber,
} from '../lib/contract-utils'
import { getUnlimitedAccountsInfo } from '../lib/get-unlimited-accounts-info'

export const getUserTokens = async (
	ctx: HypeSDK,
	wallet: PublicKey,
): Promise<UserToken[]> => {
	ctx.checkNoRootError()
	const t2022UserTA = await ctx.connection.getTokenAccountsByOwner(wallet, {
		programId: TOKEN_2022_PROGRAM_ID,
	})

	if (!t2022UserTA.value.length) return []

	const mints = t2022UserTA.value
		.map(({ account }) => {
			const buf = account.data
			const data = AccountLayout.decode(buf)
			const mintPublicKey = data.mint
			const balance = data.amount
			return {
				balance: Number(
					BigNumber(balance.toString())
						.dividedBy(ctx.root!.baseCrncyDecsFactor)
						.toString(),
				),
				mintPublicKey,
			}
		})
		.filter((ma) => ma.balance > 0)
	const tokenMintAccountsInfo = await getUnlimitedAccountsInfo(
		mints.map((ma) => ma.mintPublicKey),
		ctx.connection,
	)

	const hypeAuthority = findHypeAuthorityAddress(ctx.programId).toBase58()
	const mainTokensInfo = mints
		.map((m, i) => {
			const info = tokenMintAccountsInfo[i]
			const buf = info?.data
			let name = ''
			let socialNetwork = -1

			if (buf) {
				// const data = AccountLayout.decode(buf)
				const authority = readPubKey(buf, 4).toBase58()
				if (authority === hypeAuthority) {
					const nameLength = buf.readUInt32LE(302)
					const [_name, social] = getString(buf, 316, nameLength)
						.replace(/[\b]/gi, '')
						.split(' ')
					name = _name
					socialNetwork = getSocialNumber(social, ctx.root!)
				}
			}
			return {
				balance: m.balance,
				name,
				socialNetwork,
			}
		})
		.filter((mtd) => mtd.socialNetwork !== -1)

	const tokenAccountAddresses = mainTokensInfo.map((mtd) =>
		findTokenAccountAddress(
			ctx.programId,
			mtd.socialNetwork,
			mtd.name.toLowerCase(),
			ctx.version,
		),
	)

	const tokenAccountsInfo = await getUnlimitedAccountsInfo(
		tokenAccountAddresses,
		ctx.connection,
	)

	const tokens: UserToken[] = tokenAccountsInfo
		.map((t, i) => {
			if (!t) return
			const tad = new TokenAccountData(t.data, ctx.root!)
			return {
				...new ShortToken(tad, ctx.root!),
				balance: BigNumber(mainTokensInfo[i].balance),
			}
		})
		.filter((t) => !!t)

	return tokens
}
