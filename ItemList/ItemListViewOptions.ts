import { BaseItemDto, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByObjectsFunc, SortFuncs } from "Common/Sort";
import { EditableItemFilter } from "ItemList/EditableItemFilter";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField } from "Common/EditableField";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";

export class ItemListViewOptions {
	constructor(itemKindService: BaseItemKindService|null, data?: ItemViewOptionsData) {
		this.Label = new EditableField("Filter", Nullable.ValueOrDefault(data, "New", (d) => d.Label));

		this.ItemKindService = itemKindService;
		this.NewFilter = new Observable(undefined);
		this.Filters = new ObservableArray(Nullable.ValueOrDefault(data, [], (d) => d.Filters).map((d) => {
			const filterType = (itemKindService?.filterOptions ?? []).find((f) => f.type === d.FilterType);
			return new EditableItemFilter(filterType, d.FilterValue);
		}));

		this.SortBy = new ObservableArray(Nullable.ValueOrDefault(data, [], (d) => d.Sorts).map((d) => {
			const sort = (itemKindService?.sortOptions ?? []).find((s) => s.field === d.SortType);

			if (sort === undefined) {
				throw new Error("Missing sort type");
			}

			return this.CreateSortFunc(sort, d.Reversed);
		}));

		this.FilterFunc = new Computed(() => (item) => this.Filters.Value.every((f) => f.ShowItem(item)))
		this.SortByFunc = new Computed(() => SortByObjectsFunc(this.SortBy.Value.concat([this.CreateSortFunc(SortByName, false)])));
	}

	public CreateNewFilter(filterOption: ItemFilterType): void {
		this.NewFilter.Value = new EditableItemFilter(filterOption);
	}

	public ClearNewFilter(): void {
		this.NewFilter.Value = undefined;
	}

	public AddSort(sortFunc: ItemSortOption, reversed: boolean): void {
		this.SortBy.unshift({
			LabelKey: sortFunc.labelKey,
			Reversed: reversed,
			Sort: sortFunc.sortFunc,
		});
	}

	public AddNewFilter(): void {
		if (this.NewFilter.Value === undefined) {
			throw new Error("Cannot add new filter until it's configured.");
		}

		this.Filters.push(this.NewFilter.Value);
		this.ClearNewFilter();
	}

	private CreateSortFunc(sortOption: ItemSortOption, reversed: boolean): SortFuncs<BaseItemDto> {
		return { LabelKey: sortOption.labelKey, Sort: sortOption.sortFunc, Reversed: reversed };
	}

	public Label: EditableField;
	public ItemKindService: BaseItemKindService|null;

	public NewFilter: Observable<EditableItemFilter|undefined>;

	public Filters: ObservableArray<EditableItemFilter>;
	public SortBy: ObservableArray<SortFuncs<BaseItemDto>>;

	public FilterFunc: Computed<(item: BaseItemDto) => boolean>;
	public SortByFunc: Computed<(a: BaseItemDto, b: BaseItemDto) => number>;
}

export interface ItemViewOptionFilterData {
	FilterType: string;
	FilterValue: string|undefined;
}

export interface ItemViewOptionSortData {
	SortType: ItemSortBy;
	Reversed: boolean;
}

export interface ItemViewOptionsData {
	Label: string;
	Filters: ItemViewOptionFilterData[];
	Sorts: ItemViewOptionSortData[];
}
