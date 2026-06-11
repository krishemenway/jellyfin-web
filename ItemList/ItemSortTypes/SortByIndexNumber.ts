import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByIndexNumber: ItemSortOption = {
	labelKey: '',
	field: "IndexNumber",
	getContent: (i) => i.IndexNumber?.toString(),
	sortFunc: SortByNumber((i) => i.IndexNumber),
};

export const SortByParentIndexNumber: ItemSortOption = {
	labelKey: '',
	field: "ParentIndexNumber",
	getContent: (i) => i.ParentIndexNumber?.toString(),
	sortFunc: SortByNumber((i) => i.ParentIndexNumber),
};
