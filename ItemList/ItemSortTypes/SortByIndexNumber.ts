import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByIndexNumber: ItemSortOption = {
	labelKey: '',
	field: "IndexNumber",
	getContent: (i) => i.IndexNumber?.toString(),
	sortFunc: SortByNumber((i) => i.IndexNumber),
};
