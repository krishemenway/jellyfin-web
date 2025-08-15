import * as React from "react";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";

const TagEditor: React.FC<ItemFilterTypeProps> = (props) => {
	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	return (
		<Layout direction="column">
			<MultiSelectEditor field={props.filter.FilterValue} allOptions={props.filters.Tags ?? []} getValue={(tag) => tag} getLabel={(tag) => tag} />
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
		EmptyOperation,
		NotEmptyOperation,
	],
};
