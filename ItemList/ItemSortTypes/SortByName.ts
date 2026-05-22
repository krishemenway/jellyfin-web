import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByName: ItemSortOption = {
	labelKey: "LabelName",
	field: "Name",
	getContent: (i) => Nullable.StringValue(i.SortName, "-"),
	sortFunc: SortByString((i) => Nullable.StringValue(i.SortName, i.Name ?? "")),
};
