import * as React from "react";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { EditableField, IEditableField } from "Common/EditableField";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { Computed } from "@residualeffect/reactor";
import { TranslatedText } from "Common/TranslatedText";

export const FilterByType: ItemFilterType = {
	FilterType: "FilterByType",
	Label: "LabelType",
	CreateModel: (data) => new FilterByTypeModel(data as FilterByTypeData),
};

export interface FilterByTypeData {
	Type: "FilterByType";
	ContainsTypes: string[];
	Inverse: boolean;
}

export class FilterByTypeModel implements IFilterModel {
	constructor(data?: FilterByTypeData) {
		this.ContainsTypes = new EditableField<string[]>("ContainsType", data?.ContainsTypes ?? []);
		this.Inverse = new EditableField<boolean>("Inverse", data?.Inverse ?? false);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.ContainsTypes, this.Inverse]);
	}

	public CreateRequest(): FilterByTypeData {
		return {
			Type: "FilterByType",
			ContainsTypes: this.ContainsTypes.Current.Value,
			Inverse: this.Inverse.Current.Value,
		};
	}

	public Editor(items: BaseItemDto[]): React.ReactNode {
		return <TypeEditor typesField={this.ContainsTypes} inverseField={this.Inverse} items={items} />
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const containsTypes = this.ContainsTypes.Current.Value;
		const inverse = this.Inverse.Current.Value;

		if (!Nullable.HasValue(item.Type)) {
			return false;
		}

		return containsTypes.includes(item.Type) !== inverse;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		const types = this.ContainsTypes.Current.Value;

		return {
			Field: { Key: FilterByType.Label },
			Operation: { Key: this.Inverse.Current.Value ? "NotContainFilterDisplay" : "ContainsFilterDisplay", KeyProps: [types.join(",")] },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByType;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private ContainsTypes: EditableField<string[]>;
	private Inverse: EditableField<boolean>;
}

const TypeEditor: React.FC<{ typesField: EditableField<string[]>; inverseField: EditableField<boolean>; items: BaseItemDto[] }> = ({ typesField, inverseField, items }) => {
	const types = React.useMemo(() => Linq.Distinct(items.map((i) => i.Type ?? "")).sort(SortByString(s => s)), [items]);

	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByType.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="column">
				<MultiSelectEditor field={typesField} allOptions={types} getValue={(type) => type} getLabel={(type) => type} />
				<ToggleSwitch field={inverseField} />
			</Layout>
		</>
	);
};
