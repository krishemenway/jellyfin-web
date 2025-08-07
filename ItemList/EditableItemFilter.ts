import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed } from "@residualeffect/reactor";
import { EditableField } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { FilterOperation } from "ItemList/FilterOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemViewOptionFilterData } from "ItemList/ItemListViewOptions";

export class EditableItemFilter {
	constructor(filterType?: ItemFilterType, filterValue?: string) {
		if (filterType === undefined) {
			throw new Error("Unexpected missing filter type.");
		}

		this.Key = (EditableItemFilter.EditableItemFilterId++).toString();
		this.FilterType = filterType;

		this.Operation = new EditableField("Operation", filterType.operations[0]);
		this.FilterValue = new EditableField("Value", filterValue ?? "");

		this.DisplayValue = new Computed(() => {
			const filterValue = this.FilterValue.Current.Value;
			const operation = this.Operation.Current.Value;

			return operation.Display(filterValue) || [];
		});
	}

	public static Create(data: ItemViewOptionFilterData, availableFilters: ItemFilterType[]): EditableItemFilter {
		const filterType = availableFilters.find((f) => f.type === data.FilterType);

		if (!Nullable.HasValue(filterType)) {
			throw new Error(`Missing Filter Type ${filterType}`);
		}

		return new EditableItemFilter(filterType, data.FilterValue as string|undefined);
	}

	public ShowItem(item: BaseItemDto): boolean {
		const valueForItem = this.FilterType.targetField(item);
		const filterValue = this.FilterValue.Current.Value;

		return this.Operation.Current.Value?.Operation(valueForItem, filterValue) ?? true;
	}

	public Key: string;
	public FilterType: ItemFilterType;
	public Operation: EditableField<FilterOperation>;
	public FilterValue: EditableField;
	public DisplayValue: Computed<string[]>;

	private static EditableItemFilterId: number = 0;
}
