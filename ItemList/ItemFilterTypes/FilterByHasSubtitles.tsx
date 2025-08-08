import * as React from "react";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByHasSubtitles: ItemFilterType = {
	type: "FilterByHasSubtitles",
	labelKey: "Subtitles",
	editor: () => <></>,
	targetField: (item) => item.HasSubtitles,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
