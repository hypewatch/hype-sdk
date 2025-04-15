import { AccountLayout, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { HypeSDK } from ".";

export type Balance = {
	usdc: BigNumber;
	sol: BigNumber;
};

const LAMPORT_DECS_FACTOR = 1_000_000_000;

export const getUserBalance = async (ctx: HypeSDK, wallet: PublicKey) => {
	try {
		ctx.checkNoRootError();
		const ata = await getAssociatedTokenAddress(
			ctx.root!.baseCrncyMint,
			wallet,
		);
		const [accInfo, ataInfo] = await ctx.connection.getMultipleAccountsInfo([
			wallet,
			ata,
		]);
		if (!ataInfo?.data || !accInfo) {
			// Return zero balance if account data is not available
			return {
				usdc: new BigNumber(0),
				sol: new BigNumber(0),
			};
		}
		const ataData = AccountLayout.decode(ataInfo.data);
		const balance = {
			usdc: BigNumber(ataData.amount.toString()).dividedBy(
				ctx.root!.baseCrncyDecsFactor,
			),
			sol: BigNumber(accInfo.lamports).dividedBy(LAMPORT_DECS_FACTOR),
		};
		return balance;
	} catch (error) {
		// Return zero balance for any error
		return {
			usdc: new BigNumber(0),
			sol: new BigNumber(0),
		};
	}
};
