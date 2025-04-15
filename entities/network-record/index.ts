import { PublicKey } from "@solana/web3.js";
import { getString, readPubKey } from "../../lib/buf-utils";
import { NetworkRecordOffsets } from "./offsets";

export * from "./offsets";

export const NetworkStringLength = 32;
export const MaskStringLength = 64;
export const NetworkRecordLength = 136;

export class NetworkRecord {
	maxLength: number;
	validator: PublicKey;
	descriptor: string;
	mask: string;
	constructor(buf: Buffer, offset: number) {
		this.maxLength = buf.readInt8(offset + NetworkRecordOffsets.MaxLength);
		this.validator = readPubKey(buf, offset + NetworkRecordOffsets.Validator);
		this.descriptor = getString(
			buf,
			offset + NetworkRecordOffsets.Descriptor,
			NetworkStringLength,
		);
		this.mask = getString(
			buf,
			offset + NetworkRecordOffsets.Mask,
			MaskStringLength,
		);
	}
}
