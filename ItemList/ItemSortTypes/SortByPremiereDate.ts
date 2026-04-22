import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { parseISO } from "date-fns";

export const SortByPremiereDate: ItemSortOption = {
	labelKey: 'OptionReleaseDate',
	field: "PremiereDate",
	getContent: (i) => Nullable.StringHasValue(i.PremiereDate) ? parseISO(i.PremiereDate!).toLocaleDateString() : "—",
	sortFunc: SortByString((i) => i.PremiereDate),
};
