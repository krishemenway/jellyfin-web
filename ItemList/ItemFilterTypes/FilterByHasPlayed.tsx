import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByHasPlayed: ItemFilterType = {
	type: "FilterByHasPlayed",
	labelKey: "Played",
	editor: () => <></>,
	targetField: (item) => Nullable.HasValue(item.UserData?.Played) && item.UserData.Played,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
