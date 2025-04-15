import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
export const keypairFromPrivateKey = (base58PrivateKey: string): Keypair => {
	try {
		const privateKeyBuffer = bs58.decode(base58PrivateKey);
		return Keypair.fromSecretKey(privateKeyBuffer);
	} catch (_) {
		throw new Error("Invalid base58 private key.");
	}
};
