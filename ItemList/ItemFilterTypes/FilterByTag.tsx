import * as React from "react";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";

const TagEditor: React.FC<ItemFilterTypeProps> = (props) => {
	return (
		<Layout direction="column">
			<TextField field={props.filter.FilterValue} />
		</Layout>
	);
};

export const FilterByTag: ItemFilterType = {
	type: "FilterByTag",
	labelKey: "Tags",
	editor: TagEditor,
	targetField: (item) => item.Tags,
	operations: [
		ContainOperation,
		NotContainOperation,
	],
};
