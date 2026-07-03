import * as React from "react";
import { Layout } from "Common/Layout";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { NumberField } from "Common/TextField";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { TranslatedText, TranslationRequest } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";

export const FilterByTagCount: ItemFilterType = {
	FilterType: "FilterByTagCount",
	Label: "TagCount",
	CreateModel: (data) => new FilterByTagCountModel(data as FilterByTagCountData),
};

export interface FilterByTagCountData {
	Type: "FilterByTagCount";
	GreaterThanNumber: number|undefined;
	LessThanNumber: number|undefined;
}

export class FilterByTagCountModel implements IFilterModel {
	constructor(data?: FilterByTagCountData) {
		this.GreaterThanNumber = new EditableField<number|null|undefined>("GreaterThanNumber", data?.GreaterThanNumber);
		this.LessThanNumber = new EditableField<number|null|undefined>("LessThanNumber", data?.LessThanNumber);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.GreaterThanNumber, this.LessThanNumber]);
	}

	public CreateRequest(): FilterByTagCountData {
		return {
			Type: "FilterByTagCount",
			LessThanNumber: this.LessThanNumber.Current.Value ?? undefined,
			GreaterThanNumber: this.GreaterThanNumber.Current.Value ?? undefined,
		};
	}

	public Editor(): React.ReactNode {
		return <TagCountEditor greaterThanNumber={this.GreaterThanNumber} lessThanNumber={this.LessThanNumber} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const totalTagsCount = item.Tags?.length ?? 0;
		const greaterThan = this.GreaterThanNumber.Current.Value;
		const lessThan = this.LessThanNumber.Current.Value;

		if (Nullable.HasValue(greaterThan) && totalTagsCount < greaterThan) {
			return false;
		}

		if (Nullable.HasValue(lessThan) && totalTagsCount > lessThan) {
			return false;
		}

		return true;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		const greaterThan = this.GreaterThanNumber.Current.Value;
		const lessThan = this.LessThanNumber.Current.Value;

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
			Field: { Key: FilterByTagCount.Label },
			Operation: operation,
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByTagCount;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private GreaterThanNumber: EditableField<number|undefined|null>;
	private LessThanNumber: EditableField<number|undefined|null>;
}

const TagCountEditor: React.FC<{ greaterThanNumber: EditableField<number|undefined|null>; lessThanNumber: EditableField<number|undefined|null> }> = ({ greaterThanNumber, lessThanNumber }) => {
	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByTagCount.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" gap="1em">
				<NumberField
					field={greaterThanNumber}
					grow basis="0" px=".5em" py=".25em" minWidth={0}
					placeholder={{ Key: "LabelFrom" }}
					bt br bb bl backgroundColor="Field"
				/>

				<NumberField
					field={lessThanNumber}
					grow basis="0" px=".5em" py=".25em" minWidth={0}
					placeholder={{ Key: "LabelTo" }}
					bt br bb bl backgroundColor="Field"
				/>
			</Layout>
		</>
	);
};
