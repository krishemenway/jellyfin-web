import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const LessThanOperation: FilterOperation = {
	Name: "LessThan",
	Display: (filterValue) => typeof filterValue === "string" ? ["LessThanFilterDisplay", filterValue] : [],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "number" && typeof filterValue === "string") {
			return value < parseFloat(filterValue);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}

export const LessThanOrEqualsOperation: FilterOperation = {
	Name: "LessThanOrEquals",
	Display: (filterValue) => typeof filterValue === "string" ? ["LessThanOrEqualsFilterDisplay", filterValue] : [],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "number" && typeof filterValue === "string") {
			return value <= parseFloat(filterValue);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}
