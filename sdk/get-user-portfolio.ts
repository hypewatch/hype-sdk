import { PublicKey } from "@solana/web3.js";
import { HypeSDK } from ".";
import { Portfolio } from "../entities/portfolio";
import { getTokenReports } from "../entities/report";
import { TransactionHistoryItem } from "../entities/transaction-history";

export const getUserPortfolio = async (ctx: HypeSDK, wallet: PublicKey) => {
	ctx.checkNoRootError();
	const tokens = await ctx.getUserTokens(wallet);
	// const tokens = [
	// 	{ mint: new PublicKey('F8Ue8fncb8sLua6DvcDXunP1HFBmYcSubeejEJtZB48d') },
	// ]
	const reports = await Promise.all(
		tokens.map((t) => getTokenReports(t.mint, ctx.root!, ctx.connection)),
	);
	const portfolio: Portfolio = [];
	tokens.forEach((t, i) => {
		const history = reports[i]
			.filter((r) => r.wallet.toBase58() === wallet.toBase58())
			.map((r) => new TransactionHistoryItem(r, ctx.root!));

		const portfolioItem = { ...t, history };
		portfolio.push(portfolioItem);
	});
	return portfolio;
};
