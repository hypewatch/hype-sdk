import { UserToken } from '../token'
import { TransactionHistoryItem } from '../transaction-history'

export type PortfolioItem = UserToken & {
	history: TransactionHistoryItem[]
}
export type Portfolio = PortfolioItem[]
