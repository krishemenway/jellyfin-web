import * as React from "react";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";

const GenreEditor: React.FC<ItemFilterTypeProps> = (props) => {
	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	return (
		<Layout direction="column" minWidth="20em">
			<AutoCompleteFieldEditor field={props.filter.FilterValue} allOptions={props.filters.Genres ?? []} getKey={(genre) => genre} getLabel={(genre) => genre} />
		</Layout>
	);
};


export const FilterByGenre: ItemFilterType = {
	type: "FilterByGenre",
	labelKey: "Genres",
	editor: GenreEditor,
	targetField: (item) => item.Genres,
	operations: [
		ContainOperation,
		NotContainOperation,
		EmptyOperation,
		NotEmptyOperation,
	],
};
