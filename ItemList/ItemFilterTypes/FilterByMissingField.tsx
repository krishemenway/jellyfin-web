import * as React from "react";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/ArrayPrototype";
import { EditableField, IEditableField } from "Common/EditableField";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Computed } from "@residualeffect/reactor";
import { TranslatedText } from "Common/TranslatedText";

export const FilterByMissingField: ItemFilterType = {
	FilterType: "FilterByMissingField",
	Label: "LabelMissingFields",
	CreateModel: (data) => new FilterByMissingFieldModel(data as FilterByMissingFieldData),
};

export interface FilterByMissingFieldData {
	Type: "FilterByMissingField";
	ContainsMissingFields: string[];
}

const missingFieldOptions: Record<string, (item: BaseItemDto) => boolean> = {
	"Name": (item) => !Nullable.StringHasValue(item.Name),
	"Overview": (item) => !Nullable.StringHasValue(item.Overview),
	"Tags": (item) => (item.Tags?.length ?? 0) === 0,
	"Genres": (item) => (item.Genres?.length ?? 0) === 0,
	"Actors": (item) => (item.People?.filter((p) => p.Type === "Actor" || p.Type === "GuestStar").length ?? 0) === 0,
	"Directors": (item) => (item.People?.filter((p) => p.Type === "Director").length ?? 0) === 0,
	"Writers": (item) => (item.People?.filter((p) => p.Type === "Writer").length ?? 0) === 0,
};

export class FilterByMissingFieldModel implements IFilterModel {
	constructor(data?: FilterByMissingFieldData) {
		this.ContainsMissingFields = new EditableField<string[]>("ContainsMissingFields", data?.ContainsMissingFields ?? []);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.ContainsMissingFields]);
	}

	public CreateRequest(): FilterByMissingFieldData {
		return {
			Type: "FilterByMissingField",
			ContainsMissingFields: this.ContainsMissingFields.Current.Value,
		};
	}

	public Editor(items: BaseItemDto[]): React.ReactNode {
		return <MissingFieldEditor containsMissingFieldsField={this.ContainsMissingFields} items={items} />
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const fields = this.ContainsMissingFields.Current.Value;
		return fields.some((field) => missingFieldOptions[field](item));
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByMissingField.Label },
			Operation: { Key: "ContainsFilterDisplay", KeyProps: [this.ContainsMissingFields.Current.Value.join(",")] },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByMissingField;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private ContainsMissingFields: EditableField<string[]>;
}

const MissingFieldEditor: React.FC<{ containsMissingFieldsField: EditableField<string[]>; items: BaseItemDto[]; }> = ({ containsMissingFieldsField, items }) => {
	const fields = React.useMemo(() => Object.keys(missingFieldOptions).sort(SortByString(g => g)), [items]);

	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByMissingField.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" justifyContent="stretch" gap=".5rem">
				<MultiSelectEditor field={containsMissingFieldsField} allOptions={fields} getValue={(field) => field} getLabel={(field) => field} />
			</Layout>
		</>
	);
};
