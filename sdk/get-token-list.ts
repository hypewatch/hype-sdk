import bs58 from 'bs58'
import {
	ShortToken,
	TokenAccountData,
	TokenAccountOffsets,
} from '../entities/token'
import { AccountTags } from '../lib/enums'
import {
	TokensListParams,
	useTokensFilter,
	useTokensPagination,
	useTokensSort,
} from '../lib/token-list-params'
import { HypeSDK } from './'

export async function getTokenList(ctx: HypeSDK, options?: TokensListParams) {
	ctx.checkNoRootError()
	const { filters, sort, pagination } = options ?? {}
	const tokenAccounts = await ctx.connection.getProgramAccounts(ctx.programId, {
		filters: [
			{
				memcmp: {
					offset: TokenAccountOffsets.Tag,
					bytes: bs58.encode([AccountTags.Token]),
				},
			},
		],
	})
	const tokens = tokenAccounts.map(
		(ta) => new TokenAccountData(ta.account.data, ctx.root!),
	)
	const botTokens = tokens.map((t) => new ShortToken(t, ctx.root!))
	const filteredTokens = useTokensFilter(botTokens, filters)
	const sortedTokens = useTokensSort(filteredTokens, sort)
	const paginatedTokens = useTokensPagination(sortedTokens, pagination)
	return paginatedTokens
}
