import { FilterOperation } from "ItemList/FilterOperation";

export const IsFalseOperation: FilterOperation = {
	Name: "IsFalse",
	SupportsTypes: ["boolean"],
	Operation: () => {
		throw new Error("Not Implemented Yet");
	}
}
