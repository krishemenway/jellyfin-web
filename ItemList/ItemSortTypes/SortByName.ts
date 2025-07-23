import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByName: ItemSortOption = {
	labelKey: "LabelName",
	field: "Name",
	sortFunc: SortByString((i) => i.Name),
};
