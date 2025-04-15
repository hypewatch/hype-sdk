import { PublicKey } from "@solana/web3.js";
import { ShortRoot } from "../entities/root";
import { AccountTags } from "./enums";

const HYPE_SEED = Buffer.from("hypewtch");

export function findTokenAccountAddress(
	programId: PublicKey,
	networkId: number,
	address: string,
	version: number,
): PublicKey {
	const buf = Buffer.alloc(32);
	buf.write(address.toLowerCase(), 0, address.length, "utf-8");
	buf.writeInt32LE(networkId, 24);
	buf.writeInt32LE(version, 28);
	const hypeAuthorityAddress = findHypeAuthorityAddress(programId);
	const [tokenAccount] = PublicKey.findProgramAddressSync(
		[buf, hypeAuthorityAddress.toBytes()],
		programId,
	);
	return tokenAccount;
}

export function findClientAccountAddress(
	wallet: PublicKey,
	programId: PublicKey,
	version: number,
): PublicKey {
	const buf = Buffer.alloc(8);
	buf.writeInt32LE(version, 0);
	buf.writeInt32LE(AccountTags.Client, 4);
	const [clientAccount] = PublicKey.findProgramAddressSync(
		[buf, wallet.toBytes()],
		programId,
	);
	return clientAccount;
}

export function findHypeAuthorityAddress(programId: PublicKey): PublicKey {
	const [hypeAuthorityAddress] = PublicKey.findProgramAddressSync(
		[HYPE_SEED],
		programId,
	);
	return hypeAuthorityAddress;
}

export function getSocialNumber(social: string, root: ShortRoot) {
	const i = root.networks.findIndex((n) => {
		return social.toLowerCase() === `(${n.descriptor.toLowerCase()})`;
	});
	if (i === -1) throw Error(`network doesn't exist: ${social}`);
	return i;
}
