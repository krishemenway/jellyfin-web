import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";

const HasPlayedEditor: React.FC<ItemFilterTypeProps> = () => {
	return (
		<>
		</>
	);
};

export const FilterByHasPlayed: ItemFilterType = {
	type: "FilterByHasPlayed",
	labelKey: "Played",
	editor: HasPlayedEditor,
	targetField: (item) => Nullable.HasValue(item.UserData?.Played) && item.UserData.Played,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
