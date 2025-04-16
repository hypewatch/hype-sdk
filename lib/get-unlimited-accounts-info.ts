import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'

const ACCOUNTS_LIMIT = 100

export const getUnlimitedAccountsInfo = async (
	pubKeys: PublicKey[],
	connection: Connection,
) => {
	if (pubKeys.length <= 100) return connection.getMultipleAccountsInfo(pubKeys)
	const requests: Promise<(AccountInfo<Buffer> | null)[]>[] = []
	let offset = 0
	while (offset < pubKeys.length) {
		requests.push(
			connection.getMultipleAccountsInfo(
				pubKeys.slice(offset, offset + ACCOUNTS_LIMIT),
			),
		)
		offset += ACCOUNTS_LIMIT
	}
	const results = await Promise.all(requests)
	const accsInfo: (AccountInfo<Buffer> | null)[] = []
	results.forEach((r) => accsInfo.push(...r))
	return accsInfo.filter((ai) => !!ai)
}
