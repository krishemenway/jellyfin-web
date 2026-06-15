import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByPremiereDate: ItemSortType = {
	labelKey: 'OptionReleaseDate',
	field: "PremiereDate",
	getContent: (i) => Nullable.StringValue(i.PremiereDate, "—", (premiereDate) => DateTime.ParseWithoutZone(premiereDate).toLocaleDateString()),
	sortFunc: SortByString((i) => i.PremiereDate),
};
