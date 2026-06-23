import * as React from "react";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { SortByString } from "Common/Sort";
import { EditableField, IEditableField } from "Common/EditableField";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Computed } from "@residualeffect/reactor";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { CircleCheckmarkIcon } from "CommonIcons/CircleCheckmarkIcon";
import { CircleSlashIcon } from "CommonIcons/CircleSlashIcon";
import { TranslatedText } from "Common/TranslatedText";

export const FilterByTag: ItemFilterType = {
	FilterType: "FilterByTag",
	Label: "Tags",
	CreateModel: (data) => new FilterByTagModel(data as FilterByTagData),
};

export interface FilterByTagData {
	Type: "FilterByTag";
	ContainsTags: string[];
	Inverse: boolean;
}

export class FilterByTagModel implements IFilterModel {
	constructor(data?: FilterByTagData) {
		this.ContainsTags = new EditableField<string[]>("ContainsTags", data?.ContainsTags ?? []);
		this.Inverse = new EditableField<boolean>("Inverse", data?.Inverse ?? false);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.ContainsTags, this.Inverse]);
	}

	public CreateRequest(): FilterByTagData {
		return {
			Type: "FilterByTag",
			ContainsTags: this.ContainsTags.Current.Value,
			Inverse: this.Inverse.Current.Value,
		};
	}

	public Editor(items: BaseItemDto[]): React.ReactNode {
		return <TagEditor tagsField={this.ContainsTags} inverseField={this.Inverse} items={items} />
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const tagsToCheckFor = this.ContainsTags.Current.Value;
		const inverse = this.Inverse.Current.Value;

		return tagsToCheckFor.some((t) => item.Tags?.includes(t)) !== inverse;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByTag.Label },
			Operation: { Key: this.Inverse.Current.Value ? "NotContainFilterDisplay" : "ContainsFilterDisplay", KeyProps: [this.ContainsTags.Current.Value.join(",")] },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByTag;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private ContainsTags: EditableField<string[]>;
	private Inverse: EditableField<boolean>;
}

const TagEditor: React.FC<{ tagsField: EditableField<string[]>; inverseField: EditableField<boolean>; items: BaseItemDto[]; }> = ({ tagsField, inverseField, items }) => {
	const tags = React.useMemo(() => items.selectMany(i => i.Tags ?? []).sort(SortByString(s => s)), [items]);

	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByTag.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" justifyContent="stretch" gap=".5rem">
				<ToggleSwitch field={inverseField} enabledIcon={<CircleSlashIcon />} disabledIcon={<CircleCheckmarkIcon />} alignItems="center" justifyContent="center" px=".5em" />
				<MultiSelectEditor field={tagsField} allOptions={tags} getValue={(tag) => tag} getLabel={(tag) => tag} />
			</Layout>
		</>
	);
};
