import { SortByNumber } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByProductionYear: ItemSortType = {
	labelKey: "LabelYear",
	field: "ProductionYear",
	getContent: (i) => i.ProductionYear?.toString(),
	sortFunc: SortByNumber((i) => i.ProductionYear),
};
