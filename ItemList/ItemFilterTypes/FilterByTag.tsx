import { ContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByTag: ItemFilterType = {
	labelKey: "Tags",
	targetField: (item) => item.Tags,
	operations: [
		ContainOperation,
	],
};
