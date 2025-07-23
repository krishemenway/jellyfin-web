import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { SortByObjectsFunc, SortByString, SortFuncs } from "Common/Sort";
import { ItemFilterValue } from "ItemList/ItemFilterValue";
import { ItemSortOption } from "ItemList/ItemSortOption";

export class ItemFilter {
	constructor(id: string, label: string) {
		this.Id = id;
		this.Label = label;

		this.NewFilter = new Observable(undefined);
		this.Filters = new ObservableArray([]);
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

	public AddFilter(filter: ItemFilterValue): void {
		this.Filters.push(filter);
	}

	private CreateFilterFunc(): (item: BaseItemDto) => boolean {
		return (item) => this.Filters.Value.every((f) => f.IsFiltered(item));
	}

	private CreateSortByFunc(): (a: BaseItemDto, b: BaseItemDto) => number {
		return SortByObjectsFunc(this.SortBy.Value.concat([this.DefaultSort]));
	}

	public Id: string;
	public Label: string;

	public NewFilter: Observable<ItemFilterValue|undefined>;

	public Filters: ObservableArray<ItemFilterValue>;
	public SortBy: ObservableArray<SortFuncs<BaseItemDto>>;
	public DefaultSort: SortFuncs<BaseItemDto>;

	public FilterFunc: Computed<(item: BaseItemDto) => boolean>;
	public SortByFunc: Computed<(a: BaseItemDto, b: BaseItemDto) => number>;
}
