import * as React from "react";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";

export const FilterByOfficialRating: ItemFilterType = {
	type: "FilterByOfficialRating",
	labelKey: "LabelParentalRating",
	targetField: (item) => item.OfficialRating,
	editor: (props) => {
		if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
			return <></>;
		}

		return (
			<Layout direction="column">
				<AutoCompleteFieldEditor field={props.filter.FilterValue} allOptions={props.filters.OfficialRatings ?? []} getValue={(rating) => rating} getLabel={(rating) => rating} />
			</Layout>
		);
	},
	operations: [
		EqualOperation,
		EmptyOperation,
		NotEmptyOperation,
	],
};
