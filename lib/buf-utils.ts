import { PublicKey } from '@solana/web3.js'

export function readPubKey(buf: Buffer, offset: number) {
	return new PublicKey(buf.slice(offset, offset + 32))
}

export function getU64(base64: string): number {
	return Number(Buffer.from(base64, 'base64').readBigInt64LE())
}

export function getU32(base64: string): number {
	return Number(Buffer.from(base64, 'base64').readUint32LE())
}

export function getTime(base64: string): Date {
	return new Date(getU32(base64) * 1000)
}

export function getString(
	buf: Buffer,
	start: number,
	maxLength: number,
): string {
	let str = ''
	for (let offset = start; offset < start + maxLength; ++offset) {
		const c = buf.readUInt8(offset)
		if (c === 0) {
			break
		}
		str += String.fromCharCode(c)
	}
	return str
}

export function getStringFromEncodedBuffer(base64: string): string {
	let str = ''
	const buf = Buffer.from(base64, 'base64')
	for (let i = 0; i < buf.byteLength; ++i) {
		const c = buf.readUInt8(i)
		if (c === 0) {
			break
		}
		str += String.fromCharCode(c)
	}
	return str
}
