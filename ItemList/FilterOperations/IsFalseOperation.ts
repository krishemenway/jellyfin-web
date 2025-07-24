import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const IsFalseOperation: FilterOperation = {
	Name: "IsFalse",
	SupportsTypes: ["boolean"],
	Operation: (value) => {
		if (!Nullable.HasValue(value)) {
			return true;
		}

		if (typeof value === "boolean") {
			return !value;
		}

		throw new Error("Value not supported");
	}
}
