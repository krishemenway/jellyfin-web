import { FilterOperation } from "ItemList/FilterOperation";

export const IsTrueOperation: FilterOperation = {
	Name: "IsTrue",
	SupportsTypes: ["boolean"],
	Operation: () => {
		throw new Error("Not Implemented Yet");
	}
}
