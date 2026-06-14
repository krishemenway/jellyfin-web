import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Layout } from "Common/Layout";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { TextField } from "Common/TextField";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { CircleSlashIcon } from "CommonIcons/CircleSlashIcon";
import { CircleCheckmarkIcon } from "CommonIcons/CircleCheckmarkIcon";
import { TranslatedText } from "Common/TranslatedText";

export const FilterByName: ItemFilterType = {
	FilterType: "FilterByName",
	Label: "LabelName",
	CreateModel: (data) => new FilterByNameModel(data as FilterByNameData),
};

export interface FilterByNameData {
	Type: "FilterByName";
	Includes: string;
	Inverse: boolean;
}

export class FilterByNameModel implements IFilterModel {
	constructor(data?: FilterByNameData) {
		this.IncludesValue = new EditableField<string|undefined|null>("IncludesValue", data?.Includes);
		this.Inverse = new EditableField<boolean>("Inverse", data?.Inverse ?? false);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.IncludesValue]);
	}

	public CreateRequest(): FilterByNameData {
		return {
			Type: "FilterByName",
			Includes: this.IncludesValue.Current.Value ?? "",
			Inverse: this.Inverse.Current.Value,
		};
	}

	public Editor(): React.ReactNode {
		return <FilterByNameEditor valueField={this.IncludesValue} inverseField={this.Inverse} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		return Nullable.Value(item.Name, false, (n) => n.toLowerCase().includes(this.IncludesValue.Current.Value?.toLowerCase() ?? "")) !== this.Inverse.Current.Value;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByName.Label },
			Operation: { Key: this.Inverse.Current.Value ? "NotContainFilterDisplay" : "ContainsFilterDisplay", KeyProps: [this.IncludesValue.Current.Value ?? ""] },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByName;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private IncludesValue: EditableField<string|null|undefined>;
	private Inverse: EditableField<boolean>;
}

const FilterByNameEditor: React.FC<{ valueField: EditableField<string|null|undefined>; inverseField: EditableField<boolean>; }> = ({ valueField, inverseField }) => {
	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByName.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" justifyContent="stretch" gap=".5rem">
				<ToggleSwitch field={inverseField} enabledIcon={<CircleSlashIcon />} disabledIcon={<CircleCheckmarkIcon />} alignItems="center" justifyContent="center" px=".5em" />
				<TextField field={valueField} placeholder={{ Key: "LabelValue" }} px=".5em" py=".25em" grow />
			</Layout>
		</>
	);
};
