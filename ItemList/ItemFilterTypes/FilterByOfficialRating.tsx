import * as React from "react";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { FilterOperation } from "ItemList/FilterOperation";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { GetOrder } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByNumber, SortByObjects } from "Common/Sort";

export const LessThanRatingOperation: FilterOperation = {
	Name: "LessThan",
	Display: (filterValue) => typeof filterValue === "string" ? ["LessThanFilterDisplay", filterValue] : [],
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
		const orderedRatings = React.useMemo(() => SortByObjects(props.filters.OfficialRatings ?? [], [
			{ LabelKey: "", Reversed: false, SortType: "SortOrder", Sort: SortByNumber(rating => GetOrder(rating)) },
		]), [props.filters.OfficialRatings]);

		if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
			return <></>;
		}

		return (
			<Layout direction="column">
				<AutoCompleteFieldEditor field={props.filter.FilterValue} allOptions={orderedRatings} getValue={(rating) => rating} getLabel={(rating) => rating} />
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
