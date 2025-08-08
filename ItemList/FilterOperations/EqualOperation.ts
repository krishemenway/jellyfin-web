import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const EqualOperation: FilterOperation = {
	Name: "Equal",
	SupportsTypes: ["string", "number", "boolean"],
	Display: (filterValue) => ["IsEqual", filterValue],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "string" && typeof filterValue === "string") {
			return value.toLowerCase() === filterValue.toLowerCase();
		}

		if (typeof value === "number" && typeof filterValue === "number") {
			return value === filterValue;
		}

		throw new Error("Value not supported");
	},
};
