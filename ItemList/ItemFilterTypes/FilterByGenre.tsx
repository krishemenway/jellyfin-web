import * as React from "react";
import { MultiSelectWithSplitEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { Linq } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";

const GenreEditor: React.FC<ItemFilterTypeProps> = (props) => {
	const genres = React.useMemo(() => Linq.Distinct(Linq.SelectMany(props.items, (i) => i.Genres ?? [])).sort(SortByString(s => s)), [props.items]);

	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	return (
		<Layout direction="column">
			<MultiSelectWithSplitEditor field={props.filter.FilterValue} allOptions={genres} getValue={(genre) => genre} getLabel={(genre) => genre} />
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
