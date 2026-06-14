import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { NumberField } from "Common/TextField";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText, TranslationRequest } from "Common/TranslatedText";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";

export const FilterByProductionYear: ItemFilterType = {
	FilterType: "FilterByProductionYear",
	Label: "LabelYear",
	CreateModel: (data) => new FilterByProductionYearModel(data as FilterByProductionYearData),
};

export interface FilterByProductionYearData {
	Type: "FilterByProductionYear";
	GreaterThanYear: number|undefined;
	LessThanYear: number|undefined;
}

export class FilterByProductionYearModel implements IFilterModel {
	constructor(data?: FilterByProductionYearData) {
		this.GreaterThanYear = new EditableField<number|null|undefined>("GreaterThanNumber", data?.GreaterThanYear);
		this.LessThanYear = new EditableField<number|null|undefined>("LessThanYear", data?.LessThanYear);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.GreaterThanYear, this.LessThanYear]);
	}

	public CreateRequest(): FilterByProductionYearData {
		return {
			Type: "FilterByProductionYear",
			LessThanYear: this.LessThanYear.Current.Value ?? undefined,
			GreaterThanYear: this.GreaterThanYear.Current.Value ?? undefined,
		};
	}

	public Editor(): React.ReactNode {
		return <FilterByProductionYearEditor greaterThanNumber={this.GreaterThanYear} lessThanYear={this.LessThanYear} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const greaterThan = this.GreaterThanYear.Current.Value;
		const lessThan = this.LessThanYear.Current.Value;

		if (!Nullable.HasValue(item.ProductionYear)) {
			return false;
		}

		if (Nullable.HasValue(greaterThan) && item.ProductionYear < greaterThan) {
			return false;
		}

		if (Nullable.HasValue(lessThan) && item.ProductionYear > lessThan) {
			return false;
		}

		return true;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		const greaterThan = this.GreaterThanYear.Current.Value;
		const lessThan = this.LessThanYear.Current.Value;

		if (Nullable.HasValue(greaterThan) && Nullable.HasValue(lessThan)) {
			return this.CreateFilterDisplayConfig({ Key: "IsBetweenFilterDisplay", KeyProps: [greaterThan.toString(), lessThan.toString()] });
		} else if (Nullable.HasValue(greaterThan)) {
			return this.CreateFilterDisplayConfig({ Key: "GreaterThanFilterDisplay", KeyProps: [greaterThan.toString()] });
		} else if (Nullable.HasValue(lessThan)) {
			return this.CreateFilterDisplayConfig({ Key: "LessThanFilterDisplay", KeyProps: [lessThan.toString()] });
		}

		return undefined;
	}

	private CreateFilterDisplayConfig(operation: TranslationRequest): FilterDisplayConfig {
		return {
			Field: { Key: FilterByProductionYear.Label },
			Operation: operation,
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByProductionYear;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private GreaterThanYear: EditableField<number|undefined|null>;
	private LessThanYear: EditableField<number|undefined|null>;
}

const FilterByProductionYearEditor: React.FC<{ greaterThanNumber: EditableField<number|undefined|null>; lessThanYear: EditableField<number|undefined|null> }> = ({ greaterThanNumber, lessThanYear }) => {
	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByProductionYear.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" gap="1em">
				<NumberField
					field={greaterThanNumber}
					grow basis="0" px=".5em" py=".25em" minWidth={0}
					placeholder={{ Key: "LabelFrom" }}
				/>

				<NumberField
					field={lessThanYear}
					grow basis="0" px=".5em" py=".25em" minWidth={0}
					placeholder={{ Key: "LabelTo" }}
				/>
			</Layout>
		</>
	);
};
