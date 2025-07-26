import * as React from "react";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { GreaterThanOperation, GreaterThanOrEqualsOperation } from "ItemList/FilterOperations/GreaterThanOperation";
import { LessThanOperation, LessThanOrEqualsOperation } from "ItemList/FilterOperations/LessThanOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";

const PremiereDateEditor: React.FC<ItemFilterTypeProps> = (props) => {
	return (
		<Layout direction="column">
			This Needs to be a date picker?
		</Layout>
	);
};

export const FilterByPremiereDate: ItemFilterType = {
	type: "FilterByPremiereDate",
	labelKey: "OptionPremiereDate",
	editor: PremiereDateEditor,
	targetField: (item) => item.PremiereDate,
	operations: [
		EqualOperation,
		GreaterThanOperation,
		GreaterThanOrEqualsOperation,
		LessThanOperation,
		LessThanOrEqualsOperation,
	],
};
