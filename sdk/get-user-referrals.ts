import { PublicKey } from "@solana/web3.js";
import { HypeSDK } from ".";
import { ClientAccountData } from "../entities/client/index";
import { ClientAccountOffsets } from "../entities/client/offsets";

export const getUserReferrals = async (ctx: HypeSDK, wallet: PublicKey) => {
	const accounts = await ctx.connection.getProgramAccounts(ctx.programId, {
		filters: [
			{
				memcmp: {
					offset: ClientAccountOffsets.RefAddress,
					bytes: wallet.toBase58(),
				},
			},
		],
	});

	const accoutsPks = accounts.map((acc) => acc.pubkey);

	const clientAccountsInfo =
		await ctx.connection.getMultipleAccountsInfo(accoutsPks);

	const clients = clientAccountsInfo.map((acc) => {
		const client = new ClientAccountData(acc!.data);

		return {
			refPaid: client.refPaid,
			allTimeBaseCrncyVolume: client.allTimeBaseCrncyVolume,
		};
	});

	const earnings = clients.reduce((acc, curr) => acc + curr.refPaid, 0);
	const volume = clients.reduce(
		(acc, curr) => acc + curr.allTimeBaseCrncyVolume,
		0,
	);

	return {
		earnings: earnings,
		count: clients.length,
		volume: volume,
	};
};
