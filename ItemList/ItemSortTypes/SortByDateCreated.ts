import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByDateCreated: ItemSortType = {
	labelKey: 'OptionDateAdded',
	field: "DateCreated",
	getContent: (i) => Nullable.StringValue([i.DateLastMediaAdded, i.DateCreated].coalesce(undefined, Nullable.StringHasValue), "—", (date) => new Date(date).toLocaleString()),
	sortFunc: SortByString((i) => i.DateLastMediaAdded ?? i.DateCreated),
};
