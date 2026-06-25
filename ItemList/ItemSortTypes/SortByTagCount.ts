import { SortByNumber } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByTagCount: ItemSortType = {
	labelKey: 'TagCount',
	field: "TagCount",
	getContent: (i) => (i.Tags?.length ?? 0).toString(),
	sortFunc: SortByNumber((i) => i.Tags?.length ?? 0),
};
