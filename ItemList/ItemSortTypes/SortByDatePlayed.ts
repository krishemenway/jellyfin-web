import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { parseISO } from "date-fns";

export const SortByDatePlayed: ItemSortOption = {
	labelKey: 'OptionDatePlayed',
	field: "DatePlayed",
	getContent: (i) => Nullable.StringHasValue(i.UserData?.LastPlayedDate) ? parseISO(i.UserData?.LastPlayedDate!).toLocaleString() : "—",
	sortFunc: SortByString((i) => i.UserData?.LastPlayedDate),
};
