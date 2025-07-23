import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByPremiereDate: ItemSortOption = {
	labelKey: 'OptionReleaseDate',
	field: "PremiereDate",
	sortFunc: SortByString((i) => i.PremiereDate),
};
