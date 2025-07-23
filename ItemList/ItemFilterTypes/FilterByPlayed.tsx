import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByHasPlayed: ItemFilterType = {
	labelKey: "Series",
	targetField: (item) => item.UserData?.LastPlayedDate,
	operations: [
		EmptyOperation,
		NotEmptyOperation,
	],
};
