import BigNumber from "bignumber.js";
import { calculateTokenPrice } from "../../lib/calculations";
import { Event, MintOrBurnReport } from "../report";
import { ShortRoot } from "../root";

export class TransactionHistoryItem {
	// wallet: PublicKey
	// mint: PublicKey
	event: Event.Mint | Event.Burn;
	supplyBefore: number;
	priceBefore: BigNumber;
	supplyAfter: number;
	priceAfter: BigNumber;
	sum: BigNumber;
	tokenAmount: number;
	time: Date;
	constructor(report: MintOrBurnReport, root: ShortRoot) {
		// this.wallet = report.wallet
		// this.mint = report.mint
		this.event = report.event;
		const burnMultiplier = this.event === Event.Mint ? 1 : -1;
		this.tokenAmount = report.tokensAmount;
		this.supplyBefore = report.supply - report.tokensAmount * burnMultiplier;
		this.priceBefore = calculateTokenPrice(this.supplyBefore, root);
		this.supplyAfter = report.supply;
		this.priceAfter = calculateTokenPrice(this.supplyAfter, root);
		this.sum = report.baseCrncyAmount;
		this.time = new Date(report.time);
	}
}
