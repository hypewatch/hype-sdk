import { PublicKey } from "@solana/web3.js";
import { ShortToken } from "../token";

export const NicknameStringLength = 32;

export class ClientAccountData {
	tag: number;
	version: number;
	id: PublicKey;
	wallet: PublicKey;
	nickname: string;
	refStop: Date;
	refPaid: number;
	refDiscount: number;
	refRatio: number;
	allTimeBaseCrncyVolume: number;
	allTimeTokensVolume: number;
	tokens: ShortToken[];
	refAddress: PublicKey;

	constructor(buf: Buffer) {
		this.tag = buf.readUInt8(0);
		this.version = buf.readUInt8(1);
		this.id = new PublicKey(buf.slice(2, 34));
		this.wallet = new PublicKey(buf.slice(34, 66));
		this.nickname = buf.slice(66, 98).toString("utf8").replace(/\0/g, "");
		this.refStop = new Date(buf.readBigUInt64LE(98).toString());
		this.refPaid = Number(buf.readBigUInt64LE(106));
		this.refDiscount = Number(buf.readBigUInt64LE(114));
		this.refRatio = Number(buf.readBigUInt64LE(122));
		this.allTimeBaseCrncyVolume = Number(buf.readBigUInt64LE(130));
		this.allTimeTokensVolume = Number(buf.readBigUInt64LE(138));
		this.refAddress = new PublicKey(buf.slice(146, 178));
		this.tokens = [];
	}
}

export class ShortClient {
	wallet: PublicKey;
	nickname: string;
	refWallet: PublicKey;
	constructor(cad: ClientAccountData) {
		this.wallet = cad.wallet;
		this.nickname = cad.nickname;
		this.refWallet = cad.refAddress;
	}
}
