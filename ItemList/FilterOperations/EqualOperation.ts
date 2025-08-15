import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const EqualOperation: FilterOperation = {
	Name: "Equals",
	Display: (filterValue) => typeof filterValue === "string" ? ["IsEqual", filterValue] : [],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "string" && typeof filterValue === "string") {
			return value.toLowerCase() === filterValue.toLowerCase();
		}

		if (typeof value === "number"&& typeof filterValue === "string") {
			return value === parseFloat(filterValue);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	},
};
