import { ContainOperation, DoesNotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByName: ItemFilterType = {
	labelKey: "LabelName",
	targetField: (item) => item.Name,
	operations: [
		EqualOperation,
		ContainOperation,
		DoesNotContainOperation,
	],
};
