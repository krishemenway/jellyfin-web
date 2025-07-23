import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByRuntime: ItemSortOption = {
	labelKey: 'Runtime',
	field: "Runtime",
	sortFunc: SortByNumber((i) => i.RunTimeTicks),
};
