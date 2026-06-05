import * as React from "react";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { FilterOperation } from "ItemList/FilterOperation";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { GetOrder } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByNumber } from "Common/Sort";

export const LessThanRatingOperation: FilterOperation = {
	Name: "LessThan",
	Display: (filterValue) => typeof filterValue === "string" ? ["LessThanFilterDisplay", filterValue] : [],
	RequiresValue: true,
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)
			|| !Nullable.HasValue(filterValue)
			|| typeof value === "number"
			|| typeof value === "boolean"
			|| Array.isArray(value)
			|| Array.isArray(filterValue)) {
			return false;
		}

		return GetOrder(value) < GetOrder(filterValue);
	},
};

export const LessThanOrEqualsRatingOperation: FilterOperation = {
	Name: "LessThanOrEquals",
	Display: (filterValue) => typeof filterValue === "string" ? ["LessThanOrEqualsFilterDisplay", filterValue] : [],
	RequiresValue: true,
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)
			|| !Nullable.HasValue(filterValue)
			|| typeof value === "number"
			|| typeof value === "boolean"
			|| Array.isArray(value)
			|| Array.isArray(filterValue)) {
			return false;
		}

		return GetOrder(value) <= GetOrder(filterValue);
	},
};

export const GreaterThanRatingOperation: FilterOperation = {
	Name: "GreaterThan",
	Display: (filterValue) => typeof filterValue === "string" ? ["GreaterThanFilterDisplay", filterValue] : [],
	RequiresValue: true,
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)
			|| !Nullable.HasValue(filterValue)
			|| typeof value === "number"
			|| typeof value === "boolean"
			|| Array.isArray(value)
			|| Array.isArray(filterValue)) {
			return false;
		}

		return GetOrder(value) > GetOrder(filterValue);
	},
};

export const GreaterThanOrEqualsRatingOperation: FilterOperation = {
	Name: "GreaterThanOrEquals",
	Display: (filterValue) => typeof filterValue === "string" ? ["GreaterThanOrEqualsFilterDisplay", filterValue] : [],
	RequiresValue: true,
	Operation: (value, filterValue) => {
		if (!Nullable.HasValue(value)
			|| !Nullable.HasValue(filterValue)
			|| typeof value === "number"
			|| typeof value === "boolean"
			|| Array.isArray(value)
			|| Array.isArray(filterValue)) {
			return false;
		}

		return GetOrder(value) >= GetOrder(filterValue);
	},
};


export const FilterByOfficialRating: ItemFilterType = {
	type: "FilterByOfficialRating",
	labelKey: "LabelParentalRating",
	targetField: (item) => item.OfficialRating,
	editor: (props) => {
		const ratings = React.useMemo(() => Linq.Distinct(props.items.map((i) => i.OfficialRating).filter((i) => Nullable.HasValue(i))).sort(SortByNumber(s => GetOrder(s))), [props.items]);

		if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
			return <></>;
		}

		return (
			<Layout direction="column">
				<AutoCompleteFieldEditor field={props.filter.FilterValue} allOptions={ratings} getValue={(rating) => rating} getLabel={(rating) => rating} />
			</Layout>
		);
	},
	operations: [
		EqualOperation,
		EmptyOperation,
		NotEmptyOperation,
		LessThanRatingOperation,
		LessThanOrEqualsRatingOperation,
		GreaterThanRatingOperation,
		GreaterThanOrEqualsRatingOperation,
	],
};
