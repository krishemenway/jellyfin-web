import { ContainOperation, DoesNotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterBySeriesName: ItemFilterType = {
	labelKey: "Series",
	targetField: (item) => item.SeriesName,
	operations: [
		ContainOperation,
		DoesNotContainOperation,
		EqualOperation,
	],
};
