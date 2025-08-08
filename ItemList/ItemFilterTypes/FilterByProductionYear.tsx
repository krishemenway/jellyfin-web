import * as React from "react";
import { EqualOperation } from "ItemList/FilterOperations/EqualOperation";
import { GreaterThanOperation, GreaterThanOrEqualsOperation } from "ItemList/FilterOperations/GreaterThanOperation";
import { LessThanOperation, LessThanOrEqualsOperation } from "ItemList/FilterOperations/LessThanOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { IsBetweenOperation, IsNotBetweenOperation } from "ItemList/FilterOperations/IsBetweenOperation";
import { useObservable } from "@residualeffect/rereactor";
import { InputField } from "Common/TextField";

const ProductionYearEditor: React.FC<ItemFilterTypeProps> = (props) => {
	const current = useObservable(props.filter.FilterValue.Current);
	const [left, right] = current.split("|");
	const hasMultipleValues = props.currentOperation === IsBetweenOperation || props.currentOperation === IsNotBetweenOperation;

	return (
		<Layout direction="row" gap="1em">
			<InputField
				id="YearValueStart"
				grow basis="0" px=".5em" py=".25em" value={left ?? ""}
				placeholder={{ Key: hasMultipleValues ? "LabelFrom" : "LabelValue" }}
				onChange={((newValue) => props.filter.FilterValue.OnChange(hasMultipleValues ? `${newValue}|${right ?? ""}` : newValue))}
			/>

			{hasMultipleValues && (
				<InputField
					id="YearValueEnd"
					grow basis="0" px=".5em" py=".25em" value={right ?? ""}
					placeholder={{ Key: "LabelTo" }}
					onChange={((newValue) => props.filter.FilterValue.OnChange(`${left}|${newValue}`))}
				/>
			)}
		</Layout>
	);
};

export const FilterByProductionYear: ItemFilterType = {
	type: "FilterByProductionYear",
	labelKey: "LabelYear",
	editor: ProductionYearEditor,
	targetField: (item) => item.ProductionYear,
	operations: [
		EqualOperation,
		GreaterThanOperation,
		GreaterThanOrEqualsOperation,
		LessThanOperation,
		LessThanOrEqualsOperation,
		IsBetweenOperation,
		IsNotBetweenOperation,
	],
};
