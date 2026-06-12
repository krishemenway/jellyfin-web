import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByTagCount: ItemSortOption = {
	labelKey: 'Tags',
	field: "TagCount",
	getContent: (i) => (i.Tags?.length ?? 0).toString(),
	sortFunc: SortByNumber((i) => i.Tags?.length ?? 0),
};
