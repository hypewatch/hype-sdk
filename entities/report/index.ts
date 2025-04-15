import { Connection, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import {
	getStringFromEncodedBuffer,
	getTime,
	getU32,
	getU64,
} from "../../lib/buf-utils";
import { ShortRoot } from "../root";
import { Event, MintOrBurnReport } from "./types";

export * from "./types";

export async function getTokenLogMessages(
	tokenMint: PublicKey,
	connection: Connection,
) {
	const signatures = (await connection.getSignaturesForAddress(tokenMint)).map(
		(s) => s.signature,
	);
	const transactions = await connection.getParsedTransactions(signatures, {
		commitment: "finalized",
		maxSupportedTransactionVersion: 0,
	});
	return transactions
		.filter((t) => t?.meta?.logMessages?.length)
		.map((t) => t!.meta!.logMessages);
}

export function getMintOrBurnReports(
	logs: string[],
	root: ShortRoot,
): MintOrBurnReport[] {
	const reports: MintOrBurnReport[] = [];
	logs.forEach((log) => {
		if (log.startsWith("Program data:")) {
			const fields = log.substring(14).split(" ");
			const eventType = Buffer.from(fields[0], "base64").readUint8();
			switch (eventType) {
				case Event.Mint: {
					reports.push({
						event: Event.Mint,
						clientId: getU64(fields[1]),
						orderId: getU64(fields[2]),
						tokenId: getU64(fields[3]),
						networkId: getU32(fields[4]),
						mint: new PublicKey(Buffer.from(fields[5], "base64")),
						creator: new PublicKey(Buffer.from(fields[6], "base64")),
						address: getStringFromEncodedBuffer(fields[7]),
						supply: getU64(fields[8]) / root.baseCrncyDecsFactor,
						creationTime: getTime(fields[9]),
						allTimeTradesCount: getU64(fields[10]),
						allTimeBaseCrncyVolume:
							getU64(fields[11]) / root.baseCrncyDecsFactor,
						allTimeTokensVolume: getU64(fields[12]) / root.baseCrncyDecsFactor,
						tokensAmount: getU64(fields[13]) / root.baseCrncyDecsFactor,
						baseCrncyAmount: BigNumber(getU64(fields[14])).dividedBy(
							root.baseCrncyDecsFactor,
						),
						time: getTime(fields[15]),
						slot: getU64(fields[16]),
						wallet: new PublicKey(Buffer.from(fields[17], "base64")),
						nickname: getStringFromEncodedBuffer(fields[18]),
					});
					break;
				}
				case Event.Burn: {
					reports.push({
						event: Event.Burn,
						clientId: getU64(fields[1]),
						orderId: getU64(fields[2]),
						tokenId: getU64(fields[3]),
						networkId: getU32(fields[4]),
						mint: new PublicKey(Buffer.from(fields[5], "base64")),
						creator: new PublicKey(Buffer.from(fields[6], "base64")),
						address: getStringFromEncodedBuffer(fields[7]),
						supply: getU64(fields[8]) / root.baseCrncyDecsFactor,
						creationTime: getTime(fields[9]),
						allTimeTradesCount: getU64(fields[10]),
						allTimeBaseCrncyVolume:
							getU64(fields[11]) / root.baseCrncyDecsFactor,
						allTimeTokensVolume: getU64(fields[12]) / root.baseCrncyDecsFactor,
						tokensAmount: getU64(fields[13]) / root.baseCrncyDecsFactor,
						baseCrncyAmount: BigNumber(getU64(fields[14])).dividedBy(
							root.baseCrncyDecsFactor,
						),
						time: getTime(fields[15]),
						slot: getU64(fields[16]),
						wallet: new PublicKey(Buffer.from(fields[17], "base64")),
						nickname: getStringFromEncodedBuffer(fields[18]),
					});
					break;
				}
			}
		}
	});
	return reports;
}

export async function getTokenReports(
	tokenMint: PublicKey,
	root: ShortRoot,
	connection: Connection,
) {
	const logMessages = await getTokenLogMessages(tokenMint, connection);
	const reports: MintOrBurnReport[] = [];
	logMessages.forEach((lm) => reports.push(...getMintOrBurnReports(lm!, root)));
	return reports;
}
