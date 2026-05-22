import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { parseISO } from "date-fns";

export const SortByDateCreated: ItemSortOption = {
	labelKey: 'OptionDateAdded',
	field: "DateCreated",
	getContent: (i) => Nullable.StringValue(Linq.Coalesce([i.DateLastMediaAdded, i.DateCreated], undefined, (v) => Nullable.StringHasValue(v)), "—", (date) => parseISO(date).toLocaleString()),
	sortFunc: SortByString((i) => i.DateLastMediaAdded ?? i.DateCreated),
};
