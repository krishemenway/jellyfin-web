import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByDateCreated: ItemSortOption = {
	labelKey: 'OptionDateAdded',
	field: "DateCreated",
	sortFunc: SortByString((i) => i.DateCreated),
};
