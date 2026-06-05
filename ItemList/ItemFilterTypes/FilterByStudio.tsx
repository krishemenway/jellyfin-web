import * as React from "react";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { MultiSelectWithSplitEditor } from "Common/SelectFieldEditor";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { Linq } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";

const StudioEditor: React.FC<ItemFilterTypeProps> = (props) => {
	const studios = React.useMemo(() => Linq.Distinct(Linq.SelectMany(props.items, (i) => i.Studios ?? [])).sort(SortByString(s => s.Name)), [props.items]);

	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	return (
		<Layout direction="column">
			<MultiSelectWithSplitEditor field={props.filter.FilterValue} allOptions={studios.map((s) => s.Name ?? "")} getValue={(studioName) => studioName} getLabel={(studioName) => studioName} />
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
		EmptyOperation,
		NotEmptyOperation,
	],
};
