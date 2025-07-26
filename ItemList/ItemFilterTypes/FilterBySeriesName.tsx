import * as React from "react";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";

const SeriesNameEditor: React.FC<ItemFilterTypeProps> = (props) => {
	return (
		<Layout direction="column">
			<TextField field={props.filter.FilterValue} />
		</Layout>
	);
};

export const FilterBySeriesName: ItemFilterType = {
	type: "FilterBySeriesName",
	labelKey: "Series",
	targetField: (item) => item.SeriesName,
	editor: SeriesNameEditor,
	operations: [
		ContainOperation,
		NotContainOperation,
		EqualOperation,
	],
};
