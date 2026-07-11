import { SortByNumber } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByIndexNumber: ItemSortType = {
	labelKey: "OptionIndexNumber",
	field: "IndexNumber",
	getContent: (i) => i.IndexNumber?.toString(),
	sortFunc: SortByNumber((i) => i.IndexNumber),
};

export const SortByParentIndexNumber: ItemSortType = {
	labelKey: "OptionParentIndexNumber",
	field: "ParentIndexNumber",
	getContent: (i) => i.ParentIndexNumber?.toString(),
	sortFunc: SortByNumber((i) => i.ParentIndexNumber),
};
