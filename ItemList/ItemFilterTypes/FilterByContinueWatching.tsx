import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Layout } from "Common/Layout";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { FieldLabel } from "Common/FieldLabel";

export const FilterByContinueWatching: ItemFilterType = {
	FilterType: "FilterByContinueWatching",
	Label: "ContinueWatching",
	CreateModel: (data) => new FilterByContinueWatchingModel(data as FilterByContinueWatchingData),
};

export interface FilterByContinueWatchingData {
	Type: "FilterByContinueWatching";
	IsContinueWatching: boolean;
}

export class FilterByContinueWatchingModel implements IFilterModel {
	constructor(data?: FilterByContinueWatchingData) {
		this.IsContinueWatching = new EditableField<boolean>("IsContinueWatching", data?.IsContinueWatching ?? true);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.IsContinueWatching]);
	}

	public CreateRequest(): FilterByContinueWatchingData {
		return {
			Type: "FilterByContinueWatching",
			IsContinueWatching: this.IsContinueWatching.Current.Value,
		};
	}

	public Editor(): React.ReactNode {
		return <ContinueWatchingEditor isContinueWatchingField={this.IsContinueWatching} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const isContinueWatching = this.IsContinueWatching.Current.Value;
		return ((item.UserData?.PlayedPercentage ?? 0) > 0) === isContinueWatching;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByContinueWatching.Label },
			Operation: { Key: this.IsContinueWatching.Current.Value ? "IsTrue" : "IsFalse" },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByContinueWatching;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private IsContinueWatching: EditableField<boolean>;
}

const ContinueWatchingEditor: React.FC<{ isContinueWatchingField: EditableField<boolean>; }> = ({ isContinueWatchingField }) => {
	return (
		<Layout direction="row" gap=".5rem">
			<ToggleSwitch field={isContinueWatchingField} />
			<FieldLabel field={isContinueWatchingField} textKey={FilterByContinueWatching.Label} />
		</Layout>
	);
};
