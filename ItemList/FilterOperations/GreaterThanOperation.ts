import { FilterOperation } from "ItemList/FilterOperation";

export const GreaterThanOperation: FilterOperation = {
	Name: "GreaterThan",
	SupportsTypes: ["number"],
	Display: (filterValue) => ["GreaterThan", filterValue],
	Operation: (value, filterValue) => {
		if (typeof value === "number" && typeof filterValue === "number") {
			return value > filterValue;
		}

		throw new Error("Value not supported");
	}
}

export const GreaterThanOrEqualsOperation: FilterOperation = {
	Name: "GreaterThanOrEquals",
	SupportsTypes: ["number"],
	Display: (filterValue) => ["GreaterThanOrEquals", filterValue],
	Operation: (value, filterValue) => {
		if (typeof value === "number" && typeof filterValue === "number") {
			return value >= filterValue;
		}

		throw new Error("Value not supported");
	}
}
