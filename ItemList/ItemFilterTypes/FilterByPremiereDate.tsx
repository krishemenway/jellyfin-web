import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { GreaterThanOperation, GreaterThanOrEqualsOperation } from "ItemList/FilterOperations/GreaterThanOperation";
import { LessThanOperation, LessThanOrEqualsOperation } from "ItemList/FilterOperations/LessThanOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export const FilterByPremiereDate: ItemFilterType = {
	labelKey: "OptionPremiereDate",
	targetField: (item) => item.PremiereDate,
	operations: [
		EqualOperation,
		GreaterThanOperation,
		GreaterThanOrEqualsOperation,
		LessThanOperation,
		LessThanOrEqualsOperation,
	],
};
