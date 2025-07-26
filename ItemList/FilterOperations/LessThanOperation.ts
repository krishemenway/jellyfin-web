import { FilterOperation } from "ItemList/FilterOperation";

export const LessThanOperation: FilterOperation = {
	Name: "LessThan",
	SupportsTypes: ["number"],
	Display: (filterValue) => ["LessThan", filterValue],
	Operation: (value, filterValue) => {
		if (typeof value === "number" && typeof filterValue === "number") {
			return value < filterValue;
		}

		throw new Error("Value not supported");
	}
}

export const LessThanOrEqualsOperation: FilterOperation = {
	Name: "LessThanOrEquals",
	SupportsTypes: ["number"],
	Display: (filterValue) => ["LessThanOrEquals", filterValue],
	Operation: (value, filterValue) => {
		if (typeof value === "number" && typeof filterValue === "number") {
			return value <= filterValue;
		}

		throw new Error("Value not supported");
	}
}
