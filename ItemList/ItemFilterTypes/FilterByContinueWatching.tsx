import * as React from "react";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";

export const FilterByContinueWatching: ItemFilterType = {
	type: "FilterByContinueWatching",
	labelKey: "ContinueWatching",
	editor: () => <></>,
	targetField: (item) => (item.UserData?.PlaybackPositionTicks ?? 0) > 0,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
