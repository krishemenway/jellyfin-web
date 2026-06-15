import { DateTime } from "Common/MissingJavascriptFunctions";
import { SortByNumber } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByRuntime: ItemSortType = {
	labelKey: 'Runtime',
	field: "Runtime",
	getContent: (i) => DateTime.ConvertTicksToDurationString(i.RunTimeTicks),
	sortFunc: SortByNumber((i) => i.RunTimeTicks),
};
