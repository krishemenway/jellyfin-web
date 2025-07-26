import * as React from "react";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";

const IsFavoriteEditor: React.FC<ItemFilterTypeProps> = () => {
	return (
		<>
		</>
	);
};

export const FilterByIsFavorite: ItemFilterType = {
	type: "FilterByIsFavorite",
	labelKey: "Favorite",
	editor: IsFavoriteEditor,
	targetField: (item) => item.UserData?.IsFavorite,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
