import { PublicKey } from '@solana/web3.js'
import uniqueId from 'lodash/uniqueId'

export type HeliusPriorityFeeLevels =
	| 'Min'
	| 'Low'
	| 'Medium'
	| 'High'
	| 'VeryHigh'
	| 'UnsafeMax'
	| 'Default'

export const getPriorityFee = async (
	accountKeys: PublicKey[],
	level: HeliusPriorityFeeLevels = 'Medium',
) => {
	const res = await fetch('https://rpc-mainnet.hype.vote', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: uniqueId(),
			method: 'getPriorityFeeEstimate',
			params: [
				{
					accountKeys,
					options: {
						level,
					},
				},
			],
		}),
	})
	const data = await res.json()

	if (!data?.result?.priorityFeeEstimate)
		throw new Error('Failed to fetch priority fees from Helius RPC')

	return Math.round(data.result.priorityFeeEstimate)
}
