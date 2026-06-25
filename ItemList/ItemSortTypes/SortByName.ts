import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByName: ItemSortType = {
	labelKey: "LabelName",
	field: "Name",
	getContent: (i) => Nullable.StringValue(i.SortName, "-"),
	sortFunc: SortByString((i) => Nullable.StringValue(i.SortName, i.Name ?? "")),
};
