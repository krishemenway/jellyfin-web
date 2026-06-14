import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Layout } from "Common/Layout";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { FieldLabel } from "Common/FieldLabel";

export const FilterByHasPlayed: ItemFilterType = {
	FilterType: "FilterByHasPlayed",
	Label: "Played",
	CreateModel: (data) => new FilterByHasPlayedModel(data as FilterByHasPlayedData),
};

export interface FilterByHasPlayedData {
	Type: "FilterByHasPlayed";
	HasPlayed: boolean;
}

export class FilterByHasPlayedModel implements IFilterModel {
	constructor(data?: FilterByHasPlayedData) {
		this.HasPlayed = new EditableField<boolean>("HasEnded", data?.HasPlayed ?? true);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.HasPlayed]);
	}

	public CreateRequest(): FilterByHasPlayedData {
		return {
			Type: "FilterByHasPlayed",
			HasPlayed: this.HasPlayed.Current.Value,
		};
	}

	public Editor(): React.ReactNode {
		return <HasPlayedEditor hasPlayedField={this.HasPlayed} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		return (item.UserData?.Played ?? false) === this.HasPlayed.Current.Value;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByHasPlayed.Label },
			Operation: { Key: this.HasPlayed.Current.Value ? "IsTrue" : "IsFalse" },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByHasPlayed;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private HasPlayed: EditableField<boolean>;
}

const HasPlayedEditor: React.FC<{ hasPlayedField: EditableField<boolean>; }> = ({ hasPlayedField }) => {
	return (
		<Layout direction="row" gap=".5rem">
			<ToggleSwitch field={hasPlayedField} />
			<FieldLabel field={hasPlayedField} textKey={FilterByHasPlayed.Label} />
		</Layout>
	);
};
