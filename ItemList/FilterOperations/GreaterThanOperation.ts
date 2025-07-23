import { FilterOperation } from "ItemList/FilterOperation";

export const GreaterThanOperation: FilterOperation = {
	Name: "GreaterThan",
	SupportsTypes: ["number"],
	Operation: () => {
		throw new Error("Not Implemented Yet");
	}
}

export const GreaterThanOrEqualsOperation: FilterOperation = {
	Name: "GreaterThanOrEquals",
	SupportsTypes: ["number"],
	Operation: () => {
		throw new Error("Not Implemented Yet");
	}
}
