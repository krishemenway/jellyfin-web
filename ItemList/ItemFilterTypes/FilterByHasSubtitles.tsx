import * as React from "react";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";

const HasSubtitlesEditor: React.FC<ItemFilterTypeProps> = () => {
	return (
		<>
		</>
	);
};

export const FilterByHasSubtitles: ItemFilterType = {
	type: "FilterByHasSubtitles",
	labelKey: "Subtitles",
	editor: HasSubtitlesEditor,
	targetField: (item) => item.HasSubtitles,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
