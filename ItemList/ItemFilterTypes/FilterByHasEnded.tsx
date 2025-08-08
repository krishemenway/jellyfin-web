import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByHasEnded: ItemFilterType = {
	type: "FilterByHasEnded",
	labelKey: "Ended",
	editor: () => <></>,
	targetField: (item) => Nullable.HasValue(item.Status) && item.Status === "Ended",
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
