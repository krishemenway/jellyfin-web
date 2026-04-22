import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { parseISO } from "date-fns";

export const SortByDateCreated: ItemSortOption = {
	labelKey: 'OptionDateAdded',
	field: "DateCreated",
	getContent: (i) => Nullable.StringHasValue(i?.DateCreated) ? parseISO(i?.DateCreated!).toLocaleString() : "—",
	sortFunc: SortByString((i) => i.DateCreated),
};
