import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { parseISO } from "date-fns";

export const SortByDatePlayed: ItemSortOption = {
	labelKey: 'OptionDatePlayed',
	field: "DatePlayed",
	getContent: (i) => Nullable.StringValue(i.UserData?.LastPlayedDate, "—", (date) => parseISO(date).toLocaleString()),
	sortFunc: SortByString((i) => i.UserData?.LastPlayedDate),
};
