import { DateTime } from "Common/MissingJavascriptFunctions";
import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByRuntime: ItemSortOption = {
	labelKey: 'Runtime',
	field: "Runtime",
	getContent: (i) => DateTime.ConvertTicksToDurationString(i.RunTimeTicks),
	sortFunc: SortByNumber((i) => i.RunTimeTicks),
};
