import * as React from "react";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";

const GenreEditor: React.FC<ItemFilterTypeProps> = (props) => {
	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	return (
		<Layout direction="column">
			<MultiSelectEditor field={props.filter.FilterValue} allOptions={props.filters.Genres ?? []} getValue={(genre) => genre} getLabel={(genre) => genre} />
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
