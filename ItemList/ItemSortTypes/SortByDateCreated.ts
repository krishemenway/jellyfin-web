import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByDateCreated: ItemSortType = {
	labelKey: 'OptionDateAdded',
	field: "DateCreated",
	getContent: (i) => Nullable.StringValue(Linq.Coalesce([i.DateLastMediaAdded, i.DateCreated], undefined, (v) => Nullable.StringHasValue(v)), "—", (date) => new Date(date).toLocaleString()),
	sortFunc: SortByString((i) => i.DateLastMediaAdded ?? i.DateCreated),
};
