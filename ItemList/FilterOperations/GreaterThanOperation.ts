import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const GreaterThanOperation: FilterOperation = {
	Name: "GreaterThan",
	Display: (filterValue) => ["GreaterThanFilterDisplay", filterValue],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return true;
		}

		if (typeof value === "number") {
			return value > parseFloat(filterValue);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}

export const GreaterThanOrEqualsOperation: FilterOperation = {
	Name: "GreaterThanOrEquals",
	Display: (filterValue) => ["GreaterThanOrEqualsFilterDisplay", filterValue],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return true;
		}

		if (typeof value === "number") {
			return value >= parseFloat(filterValue);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}
