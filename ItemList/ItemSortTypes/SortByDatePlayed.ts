import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByDatePlayed: ItemSortType = {
	labelKey: 'OptionDatePlayed',
	field: "DatePlayed",
	getContent: (i) => Nullable.StringValue(i.UserData?.LastPlayedDate, "—", (date) => new Date(date).toLocaleString()),
	sortFunc: SortByString((i) => i.UserData?.LastPlayedDate),
};
