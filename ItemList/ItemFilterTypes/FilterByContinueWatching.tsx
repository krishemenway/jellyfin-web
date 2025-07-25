import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByContinueWatching: ItemFilterType = {
	labelKey: "ContinueWatching",
	targetField: (item) => (item.UserData?.PlaybackPositionTicks ?? 0) > 0,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
