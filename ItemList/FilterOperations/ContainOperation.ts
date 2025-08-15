import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const ContainOperation: FilterOperation = {
	Name: "Contains",
	Display: (filterValue) => typeof filterValue === "string" ? ["ContainsFilterDisplay", filterValue] : ["ContainsFilterDisplay", filterValue.join(", ")],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "string" && typeof filterValue === "string") {
			return value.toLowerCase().includes(filterValue.toLowerCase());
		}

		if (Array.isArray(value)) {
			if (value.length === 0) {
				return false;
			}

			if (typeof value[0] === "string") {
				return Array.isArray(filterValue) ? (value as string[]).some((v) =>  filterValue.includes(v)) : (value as string[]).includes(filterValue);
			}

			if (typeof value[0] === "number") {
				return Array.isArray(filterValue) ? (value as number[]).some((v) =>  filterValue.map((v) => parseFloat(v)).includes(v)) :  (value as number[]).includes(parseFloat(filterValue));
			}
		}

		throw new Error("Value not supported");
	}
}

export const NotContainOperation: FilterOperation = {
	Name: "NotContain",
	Display: (filterValue) => typeof filterValue === "string" ? ["NotContainFilterDisplay", filterValue] : ["NotContainFilterDisplay", filterValue.join(", ")],
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)) {
			return true;
		}

		if (typeof value === "string" && typeof filterValue === "string") {
			return !value.toLowerCase().includes(filterValue.toLowerCase());
		}

		if (Array.isArray(value)) {
			if (value.length === 0) {
				return true;
			}

			if (typeof value[0] === "string") {
				return !(Array.isArray(filterValue) ? (value as string[]).some((v) =>  filterValue.includes(v)) : (value as string[]).includes(filterValue));
			}

			if (typeof value[0] === "number") {
				return !(Array.isArray(filterValue) ? (value as number[]).some((v) =>  filterValue.map((v) => parseFloat(v)).includes(v)) :  (value as number[]).includes(parseFloat(filterValue)));
			}
		}

		throw new Error("Value not supported");
	}
}
