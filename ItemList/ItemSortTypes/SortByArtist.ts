import { SortByString } from "Common/ArrayPrototype";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByArtist: ItemSortType = {
	labelKey: "Artist",
	field: "Artist",
	getContent: (i) => Nullable.Value(i.Artists, [], a => a).join(", "),
	sortFunc: SortByString((i) => Nullable.Value(i.Artists, [], a => a).join(", ")),
};
