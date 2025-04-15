import { Commitment, Connection, Logs, PublicKey } from "@solana/web3.js";
import {
	BurnReport,
	Event,
	MintReport,
	NewTokenReport,
	Report,
	getReports,
} from "../lib/get-reports";

// Event types
export const MINT_TYPE = "mint";
export const BURN_TYPE = "burn";
export const NEWTOKEN_TYPE = "newtoken";
export const INSTRUCTION_TYPE = "instruction";

export const EVENT_MAP: Record<string, number> = {
	Mint: 0,
	Burn: 1,
	Create: 2,
};

export interface TransactionListenerConfig {
	rpcUrl: string;
	programPublicKey: string;
	commitment?: Commitment;
	onTransaction: (transaction: ParsedTransaction) => void;
}

export interface ParsedTransaction {
	id: string;
	tokenId: string;
	orderId: string;
	token: string;
	creator: string;
	wallet: string;
	address: string;
	networkId: number;
	type: "mint" | "burn" | "newtoken" | "instruction";
	committedAt: string;
	createdAt: string;
	supply: number;
	supplyDelta: number;
	baseCrncyAmount: number;
}

export class TransactionListener {
	private connection: Connection;
	private programPublicKey: PublicKey;
	private subscriptionId?: number;
	private onTransactionCallback?: (transaction: ParsedTransaction) => void;
	private baseCrncyDecsFactor = 1000000000; // Default value, should be updated from root account

	constructor(config: TransactionListenerConfig) {
		this.connection = new Connection(
			config.rpcUrl,
			config.commitment || "confirmed",
		);
		this.programPublicKey = new PublicKey(config.programPublicKey);
		this.onTransactionCallback = config.onTransaction;
	}

	/**
	 * Start listening for transactions
	 * @param onTransaction Callback for handling transactions
	 * @returns Promise that resolves when the listener is started
	 */
	public async start(
		onTransaction?: (transaction: ParsedTransaction) => void,
	): Promise<void> {
		console.log("Starting transaction listener...");

		if (onTransaction) {
			this.onTransactionCallback = onTransaction;
		}

		this.subscriptionId = this.connection.onLogs(
			this.programPublicKey,
			(logs: Logs) => this.handleLogs(logs),
			"confirmed",
		);
	}

	/**
	 * Stop listening for transactions
	 */
	public stop(): void {
		if (this.subscriptionId) {
			this.connection.removeOnLogsListener(this.subscriptionId);
			console.log("Transaction listener stopped");
		}
	}

	/**
	 * Handle incoming logs
	 * @param logs Solana logs
	 * @private
	 */
	private async handleLogs(logs: Logs): Promise<void> {
		if (logs.err !== null) {
			console.error("Received log with error:", logs.err);
			return;
		}

		try {
			const { transactions } = this.parseLogsToTransactions(logs);

			if (transactions.length > 0 && this.onTransactionCallback) {
				for (const transaction of transactions) {
					this.onTransactionCallback(transaction);
				}
			}
		} catch (error) {
			console.error("Error processing logs:", error);
		}
	}

	/**
	 * Parse logs into transactions
	 * @param logs Solana logs
	 * @returns Object containing transactions and last order ID
	 * @private
	 */
	private parseLogsToTransactions(logs: Logs): {
		transactions: ParsedTransaction[];
		lastOrderId: number;
	} {
		const transactions: ParsedTransaction[] = [];
		let lastOrderId = -1;

		try {
			// Use the SDK's getReports function to parse logs
			const reports = getReports(logs.logs, this.baseCrncyDecsFactor);

			// Process each report and convert to ParsedTransaction
			for (const report of reports) {
				const transaction = this.formatTransaction(report, logs.signature);
				if (transaction) {
					transactions.push(transaction);

					// Update lastOrderId if available
					if (transaction.orderId && !isNaN(Number(transaction.orderId))) {
						const orderId = Number(transaction.orderId);
						if (orderId > lastOrderId) {
							lastOrderId = orderId;
						}
					}
				}
			}
		} catch (error) {
			console.error("Error parsing logs:", error);
		}

		return { transactions, lastOrderId };
	}

	/**
	 * Format a report into a transaction
	 * @param report The report to format
	 * @param signature The transaction signature
	 * @returns Formatted transaction
	 * @private
	 */
	private formatTransaction(
		report: Report,
		signature: string,
	): ParsedTransaction | null {
		switch (report.event) {
			case Event.NewToken: {
				const newTokenReport = report.report as NewTokenReport;
				return {
					id: signature,
					tokenId: newTokenReport.tokenId.toString(),
					orderId: newTokenReport.orderId.toString(),
					token: newTokenReport.mint.toString(),
					creator: newTokenReport.creator.toString(),
					wallet: newTokenReport.creator.toString(), // For new tokens, creator is the wallet
					address: newTokenReport.address,
					networkId: newTokenReport.networkId,
					type: "newtoken",
					committedAt: newTokenReport.time.toISOString(),
					createdAt: newTokenReport.time.toISOString(),
					supply: 0,
					supplyDelta: 0,
					baseCrncyAmount: 0,
				};
			}
			case Event.Mint: {
				const mintReport = report.report as MintReport;
				return {
					id: signature,
					tokenId: mintReport.tokenId.toString(),
					orderId: mintReport.orderId.toString(),
					token: mintReport.mint.toString(),
					creator: mintReport.creator.toString(),
					wallet: mintReport.wallet.toString(),
					address: mintReport.address,
					networkId: mintReport.networkId,
					type: "mint",
					committedAt: mintReport.time.toISOString(),
					createdAt: mintReport.creationTime.toISOString(),
					supply: mintReport.supply,
					supplyDelta: mintReport.tokensAmount,
					baseCrncyAmount: mintReport.baseCrncyAmount,
				};
			}
			case Event.Burn: {
				const burnReport = report.report as BurnReport;
				return {
					id: signature,
					tokenId: burnReport.tokenId.toString(),
					orderId: burnReport.orderId.toString(),
					token: burnReport.mint.toString(),
					creator: burnReport.creator.toString(),
					wallet: burnReport.wallet.toString(),
					address: burnReport.address,
					networkId: burnReport.networkId,
					type: "burn",
					committedAt: burnReport.time.toISOString(),
					createdAt: burnReport.creationTime.toISOString(),
					supply: burnReport.supply,
					supplyDelta: -burnReport.tokensAmount, // Negative for burn
					baseCrncyAmount: burnReport.baseCrncyAmount,
				};
			}
			case Event.Error: {
				// For errors, create a minimal transaction with instruction type
				return {
					id: signature,
					tokenId: "",
					orderId: "",
					token: "",
					creator: "",
					wallet: "",
					address: "",
					networkId: 0,
					type: "instruction",
					committedAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					supply: 0,
					supplyDelta: 0,
					baseCrncyAmount: 0,
				};
			}
			default:
				return null;
		}
	}
}
