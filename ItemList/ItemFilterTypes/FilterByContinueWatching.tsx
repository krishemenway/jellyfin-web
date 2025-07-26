import * as React from "react";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";

const ContinueWatchingEditor: React.FC<ItemFilterTypeProps> = () => {
	return (
		<>
		</>
	);
};
export const FilterByContinueWatching: ItemFilterType = {
	type: "FilterByContinueWatching",
	labelKey: "ContinueWatching",
	editor: ContinueWatchingEditor,
	targetField: (item) => (item.UserData?.PlaybackPositionTicks ?? 0) > 0,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
