import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByProductionYear: ItemSortOption = {
	labelKey: 'LabelYear',
	field: "ProductionYear",
	sortFunc: SortByNumber((i) => i.ProductionYear),
};
