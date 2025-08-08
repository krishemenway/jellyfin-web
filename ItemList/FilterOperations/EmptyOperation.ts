import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const EmptyOperation: FilterOperation = {
	Name: "IsEmpty",
	Display: () => ["IsEmpty"],
	Operation: (value) => {
		if (!Nullable.HasValue(value)) {
			return true;
		}

		if (typeof value === "string" || Array.isArray(value)) {
			return value.length === 0;
		}

		throw new Error(`Value not supported ('${value}')`);
	},
};

export const NotEmptyOperation: FilterOperation = {
	Name: "IsNotEmpty",
	Display: () => ["IsNotEmpty"],
	Operation: (value) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "string" || Array.isArray(value)) {
			return value.length > 0;
		}

		throw new Error(`Value not supported ('${value}')`);
	},
};
