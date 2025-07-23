import { FilterOperation } from "ItemList/FilterOperation";

export const EqualOperation: FilterOperation = {
	Name: "Equal",
	SupportsTypes: ["string", "number", "boolean"],
	Operation: (value, filterValue) => {
		if (typeof value === "string" && typeof filterValue === "string") {
			return value.toLowerCase() === filterValue.toLowerCase();
		}

		if (typeof value === "number" && typeof filterValue === "number") {
			return value === filterValue;
		}

		throw new Error("Value not supported");
	},
};
