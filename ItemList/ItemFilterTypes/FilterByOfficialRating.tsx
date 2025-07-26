import * as React from "react";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";

const OfficialRatingPicker: React.FC<ItemFilterTypeProps> = (props) => {
	return (
		<Layout direction="column">
			<TextField field={props.filter.FilterValue} />
		</Layout>
	);
};

export const FilterByStudio: ItemFilterType = {
	type: "FilterByOfficialRating",
	labelKey: "LabelParentalRating",
	editor: OfficialRatingPicker,
	targetField: (item) => item.OfficialRating,
	operations: [
		ContainOperation,
		NotContainOperation,
	],
};
