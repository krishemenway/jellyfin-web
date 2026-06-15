import { SortByNumber } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByIndexNumber: ItemSortType = {
	labelKey: '',
	field: "IndexNumber",
	getContent: (i) => i.IndexNumber?.toString(),
	sortFunc: SortByNumber((i) => i.IndexNumber),
};

export const SortByParentIndexNumber: ItemSortType = {
	labelKey: '',
	field: "ParentIndexNumber",
	getContent: (i) => i.ParentIndexNumber?.toString(),
	sortFunc: SortByNumber((i) => i.ParentIndexNumber),
};
