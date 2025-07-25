import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByHasSubtitles: ItemFilterType = {
	labelKey: "Subtitles",
	targetField: (item) => item.HasSubtitles,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};


