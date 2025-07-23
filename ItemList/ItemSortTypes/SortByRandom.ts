import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByRandom: ItemSortOption = {
	labelKey: 'OptionRandom',
	field: "Random",
	sortFunc: SortByString((i) => ""), // TODO FIX THIS!
};
