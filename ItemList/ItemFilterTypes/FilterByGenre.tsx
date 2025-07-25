import { ContainOperation, DoesNotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByGenre: ItemFilterType = {
	labelKey: "Genres",
	targetField: (item) => item.Genres,
	operations: [
		ContainOperation,
		DoesNotContainOperation,
		EmptyOperation,
		NotEmptyOperation,
	],
};
