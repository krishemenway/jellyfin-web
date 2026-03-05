import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByIndexNumber: ItemSortOption = {
	labelKey: '',
	field: "IndexNumber",
	sortFunc: SortByNumber((i) => i.IndexNumber),
};
