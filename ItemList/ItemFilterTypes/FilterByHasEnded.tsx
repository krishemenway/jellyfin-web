import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Layout } from "Common/Layout";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { FieldLabel } from "Common/FieldLabel";

export const FilterByHasEnded: ItemFilterType = {
	FilterType: "FilterByHasEnded",
	Label: "Ended",
	CreateModel: (data) => new FilterByHasEndedModel(data as FilterByHasEndedData),
};

export interface FilterByHasEndedData {
	Type: "FilterByHasEnded";
	HasEnded: boolean;
}

export class FilterByHasEndedModel implements IFilterModel {
	constructor(data?: FilterByHasEndedData) {
		this.HasEnded = new EditableField<boolean>("HasEnded", data?.HasEnded ?? true);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.HasEnded]);
	}

	public CreateRequest(): FilterByHasEndedData {
		return {
			Type: "FilterByHasEnded",
			HasEnded: this.HasEnded.Current.Value,
		};
	}

	public Editor(): React.ReactNode {
		return <HasEndedEditor hasEndedField={this.HasEnded} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		return (item.Status === "Ended") === this.HasEnded.Current.Value;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByHasEnded.Label },
			Operation: { Key: this.HasEnded.Current.Value ? "IsTrue" : "IsFalse" },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByHasEnded;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private HasEnded: EditableField<boolean>;
}

const HasEndedEditor: React.FC<{ hasEndedField: EditableField<boolean>; }> = ({ hasEndedField }) => {
	return (
		<Layout direction="row" gap=".5rem">
			<ToggleSwitch field={hasEndedField} />
			<FieldLabel field={hasEndedField} textKey={FilterByHasEnded.Label} />
		</Layout>
	);
};
