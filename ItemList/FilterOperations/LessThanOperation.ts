import { FilterOperation } from "ItemList/FilterOperation";

export const LessThanOperation: FilterOperation = {
	Name: "LessThan",
	SupportsTypes: ["number"],
	Operation: () => {
		throw new Error("Not Implemented Yet");
	}
}

export const LessThanOrEqualsOperation: FilterOperation = {
	Name: "LessThanOrEquals",
	SupportsTypes: ["number"],
	Operation: () => {
		throw new Error("Not Implemented Yet");
	}
}
