import { SortByNumber } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByTagCount: ItemSortType = {
	labelKey: 'Tags',
	field: "TagCount",
	getContent: (i) => (i.Tags?.length ?? 0).toString(),
	sortFunc: SortByNumber((i) => i.Tags?.length ?? 0),
};
