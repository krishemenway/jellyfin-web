import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Layout } from "Common/Layout";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { FieldLabel } from "Common/FieldLabel";

export const FilterByIsFavorite: ItemFilterType = {
	FilterType: "FilterByIsFavorite",
	Label: "Favorite",
	CreateModel: (data) => new FilterByIsFavoriteModel(data as FilterByIsFavoriteData),
};

export interface FilterByIsFavoriteData {
	Type: "FilterByIsFavorite";
	IsFavorite: boolean;
}

export class FilterByIsFavoriteModel implements IFilterModel {
	constructor(data?: FilterByIsFavoriteData) {
		this.IsFavorite = new EditableField<boolean>("IsFavorite", data?.IsFavorite ?? false);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.IsFavorite]);
	}

	public CreateRequest(): FilterByIsFavoriteData {
		return {
			Type: "FilterByIsFavorite",
			IsFavorite: this.IsFavorite.Current.Value,
		};
	}

	public Editor(): React.ReactNode {
		return <IsFavoriteEditor isFavoriteField={this.IsFavorite} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		return (item.UserData?.IsFavorite) === this.IsFavorite.Current.Value;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByIsFavorite.Label },
			Operation: { Key: this.IsFavorite.Current.Value ? "IsTrue" : "IsFalse" },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByIsFavorite;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private IsFavorite: EditableField<boolean>;
}

const IsFavoriteEditor: React.FC<{ isFavoriteField: EditableField<boolean>; }> = ({ isFavoriteField }) => {
	return (
		<Layout direction="row" gap=".5rem">
			<ToggleSwitch field={isFavoriteField} />
			<FieldLabel field={isFavoriteField} textKey={FilterByIsFavorite.Label} />
		</Layout>
	);
};
