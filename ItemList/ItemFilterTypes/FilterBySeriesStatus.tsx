import * as React from "react";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";

export enum SeriesStatus {
	Ended = "Ended",
	Continuing = "Continuing",
}

const SeriesStatusEditor: React.FC<ItemFilterTypeProps> = (props) => {
	return (
		<Layout direction="column">
			<TextField field={props.filter.FilterValue} />
		</Layout>
	);
};

export const FilterBySeriesStatus: ItemFilterType = {
	type: "FilterBySeriesStatus",
	labelKey: "HeaderSeriesStatus",
	editor: SeriesStatusEditor,
	targetField: (item) => item.Status,
	operations: [
		ContainOperation,
		NotContainOperation,
	],
};
