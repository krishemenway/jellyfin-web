import * as React from "react";
import { MultiSelectWithSplitEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { Linq } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";

const TypeEditor: React.FC<ItemFilterTypeProps> = (props) => {
	const types = React.useMemo(() => Linq.Distinct(props.items.map((i) => i.Type ?? "")).sort(SortByString(s => s)), [props.items]);

	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	return (
		<Layout direction="column">
			<MultiSelectWithSplitEditor field={props.filter.FilterValue} allOptions={types} getValue={(type) => type} getLabel={(type) => type} />
		</Layout>
	);
};

export const FilterByType: ItemFilterType = {
	type: "FilterByType",
	labelKey: "LabelType",
	editor: TypeEditor,
	targetField: (item) => item.Type,
	operations: [
		EqualOperation,
		ContainOperation,
		NotContainOperation,
	],
};
