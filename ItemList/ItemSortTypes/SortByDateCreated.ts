import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByDateCreated: ItemSortOption = {
	labelKey: 'OptionDateAdded',
	field: "DateCreated",
	getContent: (i) => Nullable.StringValue(Linq.Coalesce([i.DateLastMediaAdded, i.DateCreated], undefined, (v) => Nullable.StringHasValue(v)), "—", (date) => new Date(date).toLocaleString()),
	sortFunc: SortByString((i) => i.DateLastMediaAdded ?? i.DateCreated),
};
