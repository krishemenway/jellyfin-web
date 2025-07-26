import * as React from "react";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";

const StudioEditor: React.FC<ItemFilterTypeProps> = (props) => {
	return (
		<Layout direction="column">
			<TextField field={props.filter.FilterValue} />
		</Layout>
	);
};

export const FilterByStudio: ItemFilterType = {
	type: "FilterByStudio",
	labelKey: "Studios",
	editor: StudioEditor,
	targetField: (item) => item.Studios?.map(s => s.Name ?? ""),
	operations: [
		ContainOperation,
		NotContainOperation,
	],
};
