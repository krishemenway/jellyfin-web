import * as React from "react";
import { MultiSelectWithSplitEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { Linq } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";

const TagEditor: React.FC<ItemFilterTypeProps> = (props) => {
	const tags = React.useMemo(() => Linq.Distinct(Linq.SelectMany(props.items, (i) => i.Tags ?? [])).sort(SortByString(s => s)), [props.items]);

	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	return (
		<Layout direction="column">
			<MultiSelectWithSplitEditor field={props.filter.FilterValue} allOptions={tags} getValue={(tag) => tag} getLabel={(tag) => tag} />
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
