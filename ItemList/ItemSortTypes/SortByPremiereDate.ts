import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByPremiereDate: ItemSortOption = {
	labelKey: 'OptionReleaseDate',
	field: "PremiereDate",
	getContent: (i) => Nullable.StringValue(i.PremiereDate, "—", (premiereDate) => DateTime.ParseWithoutZone(premiereDate).toLocaleDateString()),
	sortFunc: SortByString((i) => i.PremiereDate),
};
