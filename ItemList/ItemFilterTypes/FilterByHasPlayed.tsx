import { Nullable } from "Common/MissingJavascriptFunctions";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByHasPlayed: ItemFilterType = {
	labelKey: "Played",
	targetField: (item) => Nullable.HasValue(item.UserData?.LastPlayedDate),
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
