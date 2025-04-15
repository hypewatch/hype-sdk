import BigNumber from "bignumber.js";
import { ShortToken } from "../entities/token";

/**
 * Numeric filter parameters for token list filtering
 */
export type NumFilters = {
	/** Less than */
	lt?: BigNumber | number;
	/** Less than or equal */
	lte?: BigNumber | number;
	/** Greater than */
	gt?: BigNumber | number;
	/** Greater than or equal */
	gte?: BigNumber | number;
	/** Equal to */
	eq?: BigNumber | number;
};

/** Available fields for filtering */
export type FilterFields = "price" | "supply" | "creationTime" | "networkId";

/**
 * Filter parameters for token list
 */
export type TokensFilterParams = {
	/** Field to filter on */
	field: FilterFields;
	/** Filter conditions */
	filters: NumFilters;
}[];

/**
 * Applies filters to a list of tokens
 * @param tokens - List of tokens to filter
 * @param filters - Filter parameters to apply
 * @returns Filtered list of tokens
 */
export function useTokensFilter(
	tokens: ShortToken[],
	filters?: TokensFilterParams,
) {
	if (!filters || !filters.length) return tokens;

	let filteredTokens: ShortToken[] = [...tokens];

	for (const filter of filters) {
		const { field, filters: filterConditions } = filter;
		const { lt, lte, gt, gte, eq } = filterConditions;

		filteredTokens = filteredTokens.filter((t) => {
			switch (field) {
				case "price":
					return (
						(lt === undefined || t.price.isLessThan(lt)) &&
						(lte === undefined || t.price.isLessThanOrEqualTo(lte)) &&
						(gt === undefined || t.price.isGreaterThan(gt)) &&
						(gte === undefined || t.price.isGreaterThanOrEqualTo(gte)) &&
						(eq === undefined || t.price.isEqualTo(eq))
					);
				case "supply":
					const supply = new BigNumber(t.supply);
					return (
						(lt === undefined || supply.isLessThan(lt)) &&
						(lte === undefined || supply.isLessThanOrEqualTo(lte)) &&
						(gt === undefined || supply.isGreaterThan(gt)) &&
						(gte === undefined || supply.isGreaterThanOrEqualTo(gte)) &&
						(eq === undefined || supply.isEqualTo(eq))
					);
				case "creationTime":
					const creationTime = new BigNumber(t.creationTime.getTime());
					return (
						(lt === undefined || creationTime.isLessThan(lt)) &&
						(lte === undefined || creationTime.isLessThanOrEqualTo(lte)) &&
						(gt === undefined || creationTime.isGreaterThan(gt)) &&
						(gte === undefined || creationTime.isGreaterThanOrEqualTo(gte)) &&
						(eq === undefined || creationTime.isEqualTo(eq))
					);
				case "networkId":
          const id = new BigNumber(t.networkId);
					return (
						(lt === undefined || id.isLessThan(lt)) &&
						(lte === undefined || id.isLessThanOrEqualTo(lte)) &&
						(gt === undefined || id.isGreaterThan(gt)) &&
						(gte === undefined || id.isGreaterThanOrEqualTo(gte)) &&
						(eq === undefined || id.isEqualTo(eq))
					);
				default:
					return true;
			}
		});
	}

	return filteredTokens;
}

/** Sort direction options */
export type SortDirection = "asc" | "desc";

/** Available fields for sorting */
export type SortField = "supply" | "creationTime";

/**
 * Sort parameters for token list
 */
export type TokensSortParams = {
	/** Field to sort by */
	field: SortField;
	/** Sort direction */
	direction: SortDirection;
};

/**
 * Applies sorting to a list of tokens
 * @param tokens - List of tokens to sort
 * @param sort - Sort parameters to apply
 * @returns Sorted list of tokens
 */
export const useTokensSort = (
	tokens: ShortToken[],
	sort?: TokensSortParams,
) => {
	if (!sort || !tokens.length) return tokens;
	const { field, direction } = sort;
	if (typeof tokens[0][field] === "number") {
		return tokens.sort((a, b) => {
			return (
				((a[field] as number) - (b[field] as number)) *
				(direction === "asc" ? 1 : -1)
			);
		});
	}
	if (typeof tokens[0][field].getMonth === "function") {
		return tokens.sort((a, b) => {
			if (direction === "asc") {
				return a[field].toString() < b[field].toString() ? -1 : 1;
			}
			return a[field].toString() > b[field].toString() ? -1 : 1;
		});
	}
	return tokens;
};

/**
 * Pagination parameters for token list
 */
export type TokensPaginationParams = {
	/** Maximum number of items to return */
	limit: number;
	/** Number of items to skip */
	offset: number;
};

/**
 * Applies pagination to a list of tokens
 * @param tokens - List of tokens to paginate
 * @param pagination - Pagination parameters to apply
 * @returns Paginated list of tokens
 */
export const useTokensPagination = (
	tokens: ShortToken[],
	pagination?: TokensPaginationParams,
) => {
	if (!pagination || !tokens.length) return tokens;
	const { limit, offset } = pagination;
	return tokens.slice(offset, offset + limit);
};

/**
 * Complete parameters for token list operations
 * Includes filtering, sorting, and pagination options
 */
export type TokensListParams = {
	/** Filter parameters */
	filters?: TokensFilterParams;
	/** Sort parameters */
	sort?: TokensSortParams;
	/** Pagination parameters */
	pagination?: TokensPaginationParams;
};
