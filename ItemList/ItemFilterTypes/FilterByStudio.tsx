import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { Computed } from "@residualeffect/reactor";
import { EditableField, IEditableField } from "Common/EditableField";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { CircleSlashIcon } from "CommonIcons/CircleSlashIcon";
import { CircleCheckmarkIcon } from "CommonIcons/CircleCheckmarkIcon";
import { TranslatedText } from "Common/TranslatedText";

export const FilterByStudio: ItemFilterType = {
	FilterType: "FilterByStudio",
	Label: "Studios",
	CreateModel: (data) => new FilterByStudiosModel(data as FilterByStudioData),
};

export interface FilterByStudioData {
	Type: "FilterByStudio";
	ContainsStudios: string[];
	Inverse: boolean;
}

export class FilterByStudiosModel implements IFilterModel {
	constructor(data?: FilterByStudioData) {
		this.ContainsStudios = new EditableField<string[]>("ContainsStudios", data?.ContainsStudios ?? []);
		this.Inverse = new EditableField<boolean>("Inverse", data?.Inverse ?? false);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.ContainsStudios, this.Inverse]);
	}

	public CreateRequest(): FilterByStudioData {
		return {
			Type: "FilterByStudio",
			ContainsStudios: this.ContainsStudios.Current.Value,
			Inverse: this.Inverse.Current.Value,
		};
	}

	public Editor(items: BaseItemDto[]): React.ReactNode {
		return <StudioEditor studiosField={this.ContainsStudios} inverseField={this.Inverse} items={items} />
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const studiosToCheckFor = this.ContainsStudios.Current.Value;
		const studios = item.Studios?.map(s => s.Name).filter(s => Nullable.HasValue(s)) ?? [];
		const inverse = this.Inverse.Current.Value;

		return studiosToCheckFor.some((s) => studios.includes(s)) !== inverse;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		const studios = this.ContainsStudios.Current.Value;

		return {
			Field: { Key: FilterByStudio.Label },
			Operation: { Key: this.Inverse.Current.Value ? "NotContainFilterDisplay" : "ContainsFilterDisplay", KeyProps: [studios.join(",")] },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByStudio;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private ContainsStudios: EditableField<string[]>;
	private Inverse: EditableField<boolean>;
}

const StudioEditor: React.FC<{ studiosField: EditableField<string[]>; inverseField: EditableField<boolean>; items: BaseItemDto[]; }> = ({ studiosField, inverseField, items }) => {
	const studios = React.useMemo(() => Linq.Distinct(Linq.SelectMany(items, (i) => i.Studios ?? [])).sort(SortByString(s => s.Name)), [items]);

	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByStudio.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" justifyContent="stretch" gap=".5rem">
				<ToggleSwitch field={inverseField} enabledIcon={<CircleSlashIcon />} disabledIcon={<CircleCheckmarkIcon />} alignItems="center" justifyContent="center" px=".5em" />
				<MultiSelectEditor field={studiosField} allOptions={studios.map((s) => s.Name ?? "")} getValue={(studioName) => studioName} getLabel={(studioName) => studioName} />
			</Layout>
		</>
	);
};
