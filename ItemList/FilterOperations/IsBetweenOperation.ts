import { FilterOperation } from "ItemList/FilterOperation";

export const IsBetweenOperation: FilterOperation = {
	Name: "IsBetween",
	Display: (filterValue) => ["IsBetweenFilterDisplay"].concat(filterValue.split("|")),
	Operation: (value, filterValue) => {
		if (typeof value === "number") {
			const [greaterThan, lessThan] = filterValue.split("|");
			return value > parseFloat(greaterThan) && value < parseFloat(lessThan);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}

export const IsNotBetweenOperation: FilterOperation = {
	Name: "IsNotBetween",
	Display: (filterValue) => ["IsNotBetweenFilterDisplay"].concat(filterValue.split("|")),
	Operation: (value, filterValue) => {
		if (typeof value === "number") {
			const [greaterThan, lessThan] = filterValue.split("|");
			return value < parseFloat(greaterThan) && value > parseFloat(lessThan);
		}

		throw new Error(`Value not supported ('${value}') with filter value ('${filterValue}')`);
	}
}
