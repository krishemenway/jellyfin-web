import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const EmptyOperation: FilterOperation = {
	Name: "Empty",
	Display: () => ["IsEmpty"],
	SupportsTypes: ["string", "string[]", "number[]"],
	Operation: (value) => {
		if (!Nullable.HasValue(value)) {
			return true;
		}

		if (typeof value === "string" || Array.isArray(value)) {
			return value.length === 0;
		}

		throw new Error("Value not supported");
	},
};

export const NotEmptyOperation: FilterOperation = {
	Name: "NotEmpty",
	Display: () => ["IsNotEmpty"],
	SupportsTypes: ["string", "string[]", "number[]"],
	Operation: (value) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "string" || Array.isArray(value)) {
			return value.length > 0;
		}

		throw new Error("Value not supported");
	},
};
