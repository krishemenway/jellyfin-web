import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByObjectsFunc, SortByString, SortFuncs } from "Common/Sort";
import { EditableItemFilter } from "ItemList/EditableItemFilter";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { ItemFilterType } from "./ItemFilterType";

export class ItemListViewOptions {
	constructor(label: string, availableFilters: ItemFilterType[], data?: ItemViewOptionsData) {
		this.Label = label;

		this.NewFilter = new Observable(undefined);
		this.Filters = new ObservableArray(Nullable.ValueOrDefault(data, [], (d) => d.Filters).map((d) => new EditableItemFilter(availableFilters.find((f) => f.type === d.FilterType), d.FilterValue)));
		this.SortBy = new ObservableArray([]);

		this.DefaultSort = {
			LabelKey: "LabelName",
			Sort: SortByString((i) => i.Name),
			Reversed: false,
		};

		this.FilterFunc = new Computed(() => this.CreateFilterFunc())
		this.SortByFunc = new Computed(() => this.CreateSortByFunc());
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
		this.NewFilter.Value = undefined;
	}

	private CreateFilterFunc(): (item: BaseItemDto) => boolean {
		return (item) => this.Filters.Value.every((f) => f.ShowItem(item));
	}

	private CreateSortByFunc(): (a: BaseItemDto, b: BaseItemDto) => number {
		return SortByObjectsFunc(this.SortBy.Value.concat([this.DefaultSort]));
	}

	public Label: string;

	public NewFilter: Observable<EditableItemFilter|undefined>;

	public Filters: ObservableArray<EditableItemFilter>;
	public SortBy: ObservableArray<SortFuncs<BaseItemDto>>;
	public DefaultSort: SortFuncs<BaseItemDto>;

	public FilterFunc: Computed<(item: BaseItemDto) => boolean>;
	public SortByFunc: Computed<(a: BaseItemDto, b: BaseItemDto) => number>;
}

export interface ItemViewOptionFilterData {
	FilterType: string;
	FilterValue: string|undefined;
}

export interface ItemViewOptionSortData {
	SortType: string;
	Reversed: boolean;
}

export interface ItemViewOptionsData {
	Label: string;
	Filters: ItemViewOptionFilterData[];
	Sorts: ItemViewOptionSortData[];
}
