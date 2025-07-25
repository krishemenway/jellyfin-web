import { ContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByStudio: ItemFilterType = {
	labelKey: "Studios",
	targetField: (item) => item.Studios?.map(s => s.Name ?? ""),
	operations: [
		ContainOperation,
	],
};
