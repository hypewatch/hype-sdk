import { PublicKey } from "@solana/web3.js";

/**
 * @property {number} orderId Event order ID
 * @property {number} clientId Client ID
 * @property {number} tokenId Token ID
 * @property {number} networkId Token ID
 * @property {PublicKey} mint Token mint
 * @property {PublicKey} creator Token creator public key
 * @property {string} address Token address
 * @property {number} supply Token supply
 * @property {Date} creationTime Creation time
 * @property {number} allTimeTradesCount Token all time trades count
 * @property {number} allTimeBaseCrncyVolume Token all time base currency volume
 * @property {number} allTimeTokensVolume Token all time tokensvolume
 * @property {number} baseCrncyAmount Trade's base currency amount
 * @property {number} tokenId Traded tokens amount
 * @property {Date} time Event time
 * @property {number} slot Event slot
 */
export interface BurnReport {
	clientId: number;
	orderId: number;
	tokenId: number;
	networkId: number;
	mint: PublicKey;
	creator: PublicKey;
	wallet: PublicKey;
	address: string;
	nickname: string;
	supply: number;
	creationTime: Date;
	allTimeTradesCount: number;
	allTimeBaseCrncyVolume: number;
	allTimeTokensVolume: number;
	tokensAmount: number;
	baseCrncyAmount: number;
	time: Date;
	slot: number;
}

/**
 * @property {number} Error Error event
 * @property {number} NewClient New client event
 * @property {number} NewNetwork New network event
 * @property {number} NewToken New token event
 * @property {number} Mint Mint event
 * @property {number} Burn Burn event
 */
export enum Event {
	Error = 0,
	NewClient = 1,
	NewNetwork = 2,
	NewToken = 3,
	Mint = 4,
	Burn = 5,
}

/**
 * @property {number} orderId Event order ID
 * @property {number} clientId Client ID
 * @property {number} tokenId Token ID
 * @property {number} networkId Token ID
 * @property {PublicKey} mint Token mint
 * @property {PublicKey} creator Token creator public key
 * @property {string} address Token address
 * @property {number} supply Token supply
 * @property {Date} creationTime Creation time
 * @property {number} allTimeTradesCount Token all time trades count
 * @property {number} allTimeBaseCrncyVolume Token all time base currency volume
 * @property {number} allTimeTokensVolume Token all time tokensvolume
 * @property {number} baseCrncyAmount Trade's base currency amount
 * @property {number} tokenId Traded tokens amount
 * @property {Date} time Event time
 * @property {number} slot Event slot
 */
export interface MintReport {
	clientId: number;
	orderId: number;
	tokenId: number;
	networkId: number;
	mint: PublicKey;
	creator: PublicKey;
	wallet: PublicKey;
	address: string;
	nickname: string;
	supply: number;
	creationTime: Date;
	allTimeTradesCount: number;
	allTimeBaseCrncyVolume: number;
	allTimeTokensVolume: number;
	tokensAmount: number;
	baseCrncyAmount: number;
	time: Date;
	slot: number;
}

/**
 * @property {number} networkId New network ID
 * @property {string} descriptor Betwork descriptor string
 * @property {Date} time Event time
 * @property {number} slot Event slot
 */
export interface NewNetworkReport {
	networkId: number;
	descriptor: string;
	time: Date;
	slot: number;
}

/**
 * @property {number} orderId Event order ID
 * @property {number} clientId New client ID
 * @property {PublicKey} wallet Client wallet
 * @property {Date} time Event time
 * @property {number} slot Event slot
 */
export interface NewClientReport {
	orderId: number;
	clientId: number;
	wallet: PublicKey;
	nickname: string;
	time: Date;
	slot: number;
}

/**
 * @property {number} orderId Event order ID
 * @property {number} clientId Creator's client ID
 * @property {number} tokenId New token ID
 * @property {number} networkId Network ID
 * @property {PublicKey} mint Token mint
 * @property {PublicKey} creator Token creator public key
 * @property {string} address Token address
 * @property {Date} time Event time
 * @property {number} slot Event slot
 */
export interface NewTokenReport {
	orderId: number;
	clientId: number;
	networkId: number;
	mint: PublicKey;
	creator: PublicKey;
	address: string;
	tokenId: number;
	time: Date;
	slot: number;
}

export interface Report {
	event: Event;
	report:
		| NewClientReport
		| NewNetworkReport
		| NewTokenReport
		| MintReport
		| BurnReport
		| string;
}

function getU64(base64: string): number {
	return Number(Buffer.from(base64, "base64").readBigInt64LE());
}

function getU32(base64: string): number {
	return Number(Buffer.from(base64, "base64").readUint32LE());
}

function getTime(base64: string): Date {
	return new Date(getU32(base64) * 1000);
}

function getString(base64: string): string {
	let str = "";
	const buf = Buffer.from(base64, "base64");
	for (var i = 0; i < buf.byteLength; ++i) {
		const c = buf.readUInt8(i);
		if (c == 0) {
			break;
		}
		str += String.fromCharCode(c);
	}
	return str;
}

export function getReports(logs: string[], decsFactor: number): Report[] {
	const reports: Report[] = [];
	for (var log of logs) {
		if (log.startsWith("Program data:")) {
			const fields = log.substring(14).split(" ");
			switch (Buffer.from(fields[0], "base64").readUint8()) {
				case Event.NewClient: {
					reports.push({
						event: Event.NewClient,
						report: {
							clientId: getU64(fields[1]),
							orderId: getU64(fields[2]),
							wallet: new PublicKey(Buffer.from(fields[3], "base64")),
							time: getTime(fields[4]),
							slot: getU64(fields[5]),
							nickname: getString(fields[6]),
						},
					});
					break;
				}
				case Event.NewNetwork: {
					reports.push({
						event: Event.NewNetwork,
						report: {
							networkId: getU32(fields[1]),
							descriptor: getString(fields[2]),
							time: getTime(fields[3]),
							slot: getU64(fields[4]),
						},
					});
					break;
				}
				case Event.NewToken: {
					reports.push({
						event: Event.NewToken,
						report: {
							clientId: getU64(fields[1]),
							orderId: getU64(fields[2]),
							tokenId: getU64(fields[3]),
							networkId: getU32(fields[4]),
							mint: new PublicKey(Buffer.from(fields[5], "base64")),
							creator: new PublicKey(Buffer.from(fields[6], "base64")),
							address: getString(fields[7]),
							time: getTime(fields[8]),
							slot: getU64(fields[9]),
						},
					});
					break;
				}
				case Event.Mint: {
					reports.push({
						event: Event.Mint,
						report: {
							clientId: getU64(fields[1]),
							orderId: getU64(fields[2]),
							tokenId: getU64(fields[3]),
							networkId: getU32(fields[4]),
							mint: new PublicKey(Buffer.from(fields[5], "base64")),
							creator: new PublicKey(Buffer.from(fields[6], "base64")),
							address: getString(fields[7]),
							supply: getU64(fields[8]) / decsFactor,
							creationTime: getTime(fields[9]),
							allTimeTradesCount: getU64(fields[10]),
							allTimeBaseCrncyVolume: getU64(fields[11]) / decsFactor,
							allTimeTokensVolume: getU64(fields[12]) / decsFactor,
							tokensAmount: getU64(fields[13]) / decsFactor,
							baseCrncyAmount: getU64(fields[14]) / decsFactor,
							time: getTime(fields[15]),
							slot: getU64(fields[16]),
							wallet: new PublicKey(Buffer.from(fields[17], "base64")),
							nickname: getString(fields[18]),
						},
					});
					break;
				}
				case Event.Burn: {
					reports.push({
						event: Event.Burn,
						report: {
							clientId: getU64(fields[1]),
							orderId: getU64(fields[2]),
							tokenId: getU64(fields[3]),
							networkId: getU32(fields[4]),
							mint: new PublicKey(Buffer.from(fields[5], "base64")),
							creator: new PublicKey(Buffer.from(fields[6], "base64")),
							address: getString(fields[7]),
							supply: getU64(fields[8]) / decsFactor,
							creationTime: getTime(fields[9]),
							allTimeTradesCount: getU64(fields[10]),
							allTimeBaseCrncyVolume: getU64(fields[11]) / decsFactor,
							allTimeTokensVolume: getU64(fields[12]) / decsFactor,
							tokensAmount: getU64(fields[13]) / decsFactor,
							baseCrncyAmount: getU64(fields[14]) / decsFactor,
							time: getTime(fields[15]),
							slot: getU64(fields[16]),
							wallet: new PublicKey(Buffer.from(fields[17], "base64")),
							nickname: getString(fields[18]),
						},
					});
					break;
				}
			}
		} else if (log.startsWith("Error:")) {
			reports.push({
				event: Event.Error,
				report: log.substring(7),
			});
		}
	}
	return reports;
}
