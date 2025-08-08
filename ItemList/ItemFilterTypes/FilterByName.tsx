import * as React from "react";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";

const NameEditor: React.FC<ItemFilterTypeProps> = (props) => {
	return (
		<Layout direction="column">
			<TextField field={props.filter.FilterValue} placeholder={{ Key: "LabelValue" }} px=".5em" py=".25em" />
		</Layout>
	);
};

export const FilterByName: ItemFilterType = {
	type: "FilterByName",
	labelKey: "LabelName",
	editor: NameEditor,
	targetField: (item) => item.Name,
	operations: [
		EqualOperation,
		ContainOperation,
		NotContainOperation,
	],
};
