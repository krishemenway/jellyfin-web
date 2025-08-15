import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const IsBetweenOperation: FilterOperation = {
	Name: "IsBetween",
	Display: (filterValue) => ["IsBetweenFilterDisplay"].concat(filterValue),
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "number" && Array.isArray(filterValue)) {
			const [greaterThan, lessThan] = filterValue;
			return value > parseFloat(greaterThan) && value < parseFloat(lessThan);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}

export const IsNotBetweenOperation: FilterOperation = {
	Name: "IsNotBetween",
	Display: (filterValue) => ["IsNotBetweenFilterDisplay"].concat(filterValue),
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "number" && Array.isArray(filterValue)) {
			const [greaterThan, lessThan] = filterValue;
			return value < parseFloat(greaterThan) && value > parseFloat(lessThan);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}
