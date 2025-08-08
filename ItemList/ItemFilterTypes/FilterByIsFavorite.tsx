import * as React from "react";
import { IsFalseOperation } from "ItemList/FilterOperations/IsFalseOperation";
import { IsTrueOperation } from "ItemList/FilterOperations/IsTrueOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByIsFavorite: ItemFilterType = {
	type: "FilterByIsFavorite",
	labelKey: "Favorite",
	editor: () => <></>,
	targetField: (item) => item.UserData?.IsFavorite,
	operations: [
		IsTrueOperation,
		IsFalseOperation,
	],
};
