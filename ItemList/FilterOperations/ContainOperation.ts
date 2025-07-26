import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const ContainOperation: FilterOperation = {
	Name: "Contains",
	Display: (filterValue) => ["Contains", filterValue],
	SupportsTypes: ["string", "string[]", "number[]"],
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

			if (typeof value[0] === "string" && typeof filterValue === "string") {
				return (value as string[]).includes(filterValue);
			}

			if (typeof value[0] === "number" && typeof filterValue === "number") {
				return (value as number[]).includes(filterValue);
			}
		}

		throw new Error("Value not supported");
	}
}

export const NotContainOperation: FilterOperation = {
	Name: "NotContain",
	Display: (filterValue) => ["NotContain", filterValue],
	SupportsTypes: ["string", "string[]", "number[]"],
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

			if (typeof value[0] === "string" && typeof filterValue === "string") {
				return !(value as string[]).includes(filterValue);
			}

			if (typeof value[0] === "number" && typeof filterValue === "number") {
				return !(value as number[]).includes(filterValue);
			}
		}

		throw new Error("Value not supported");
	}
}
