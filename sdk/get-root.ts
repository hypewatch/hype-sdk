import { HypeSDK } from "./";

export async function getRoot(ctx: HypeSDK) {
	ctx.checkNoRootError();
	return ctx.root;
}
