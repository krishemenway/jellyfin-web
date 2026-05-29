import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByDatePlayed: ItemSortOption = {
	labelKey: 'OptionDatePlayed',
	field: "DatePlayed",
	getContent: (i) => Nullable.StringValue(i.UserData?.LastPlayedDate, "—", (date) => new Date(date).toLocaleString()),
	sortFunc: SortByString((i) => i.UserData?.LastPlayedDate),
};
