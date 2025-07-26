import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";

export const IsTrueOperation: FilterOperation = {
	Name: "IsTrue",
	SupportsTypes: ["boolean"],
	Display: () => ["IsTrue"],
	Operation: (value) => {
		if (!Nullable.HasValue(value)) {
			return false;
		}

		if (typeof value === "boolean") {
			return value;
		}

		throw new Error("Value not supported");
	}
}
