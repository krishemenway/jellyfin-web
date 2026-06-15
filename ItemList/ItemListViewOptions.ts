import { BaseItemDto, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByObjectsFunc, SortFuncs } from "Common/Sort";
import { CreateSortFunc, ItemSortType } from "ItemList/ItemSortType";
import { IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, ValueIsRequired } from "Common/EditableField";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { ItemSortTypeStore } from "ItemList/ItemSortOptionStore";
import { ItemFilterTypeStore, ItemFilterData } from "ItemList/ItemFilterTypeStore";

export class ItemListViewOptions {
	constructor(dataSource: ItemViewOptionDataSource, data?: ItemViewOptionsData, canSave?: boolean) {
		this.Key = Nullable.Value(data?.Key, self.crypto.randomUUID(), k => k);
		this.IsUnsaved = !Nullable.HasValue(data);
		this.CanSave = canSave ?? true;
		this.Label = new EditableField("Filter", Nullable.Value(data, "", (d) => d.Label), (v) => ValueIsRequired(v));
		this.ShowErrors = new Observable(false);
		this.DataSource = data?.DataSource ?? dataSource;

		this.NewFilter = new Observable(undefined);
		this.Filters = new ObservableArray(Nullable.Value(data, [], (d) => d.Filters).map((d) => ItemFilterTypeStore.Instance.FindOrThrow(d.Type).CreateModel(d)));

		this.SortBy = new ObservableArray(Nullable.Value(data, [], (d) => d.Sorts).map(d => {
			return CreateSortFunc(ItemSortTypeStore.Instance.FindOrThrow(d.SortType), d.Reversed, d.Hidden);
		}));

		this.FilterFunc = new Computed(() => (item) => this.Filters.Value.every(f => f.Filter.Value(item)))
		this.SortByFunc = new Computed(() => SortByObjectsFunc(this.SortBy.Value.concat([CreateSortFunc(SortByName, false, false)])));
	}

	public CreateNewFilter(filterOption: ItemFilterType): void {
		this.NewFilter.Value = filterOption.CreateModel();
	}

	public ClearNewFilter(): void {
		this.NewFilter.Value = undefined;
		this.ShowErrors.Value = false;
	}

	public AddSort(sortType: ItemSortType, reversed: boolean): void {
		this.SortBy.unshift(CreateSortFunc(sortType, reversed, false));
	}

	public ReverseSort(sort: SortFuncs<BaseItemDto>): void {
		const current = this.SortBy.AsArray();
		const currentIndex = current.indexOf(sort);
		current[currentIndex].Reversed = !current[currentIndex].Reversed;
		this.SortBy.Value = current;
	}

	public HideSort(sort: SortFuncs<BaseItemDto>): void {
		const current = this.SortBy.AsArray();
		const currentIndex = current.indexOf(sort);
		current[currentIndex].Hidden = !current[currentIndex].Hidden;
		this.SortBy.Value = current;
	}

	public AddNewFilter(onAddedSuccessfully: () => void): void {
		const newFilter = this.NewFilter.Value!;

		if (newFilter.AllFields.Value.every((f) => f.CanMakeRequest())) {
			this.Filters.push(newFilter);
			this.ClearNewFilter();
			onAddedSuccessfully();
		} else {
			this.ShowErrors.Value = true;
		}
	}

	public static CreateRecentlyAdded(dataSource: ItemViewOptionDataSource, dataSourceName: string): ItemListViewOptions {
		return new ItemListViewOptions(dataSource, { DataSource: dataSource, Key: `RecentlyAdded-${dataSource.DataSourceKey}`, Filters: [], Label: `${dataSourceName} - Recently Added`, Sorts: [{ Reversed: true, SortType: "DateCreated", Hidden: true }] }, false);
	}

	public CreateSaveRequest(): ItemViewOptionsData {
		return {
			Key: this.Key,
			DataSource: this.DataSource,
			Label: this.Label.Current.Value,
			Filters: this.Filters.Value.map((i) => i.CreateRequest()),
			Sorts: this.SortBy.Value.map((s) => ({ SortType: s.SortType, Reversed: s.Reversed, Hidden: s.Hidden }) as ItemViewOptionSortData),
		};
	}

	public BuildStorageKey(): string {
		return `ViewOption|${this.Key}`;
	}

	public Key: string;
	public IsUnsaved: boolean;
	public CanSave: boolean;
	public Label: EditableField<string>;
	public ShowErrors: Observable<boolean>;
	public DataSource: ItemViewOptionDataSource;

	public NewFilter: Observable<IFilterModel|undefined>;

	public Filters: ObservableArray<IFilterModel>;
	public SortBy: ObservableArray<SortFuncs<BaseItemDto>>;

	public FilterFunc: Computed<(item: BaseItemDto) => boolean>;
	public SortByFunc: Computed<(a: BaseItemDto, b: BaseItemDto) => number>;
}

export interface ItemViewOptionFilterData {
	FilterType: string;
	FilterValue: string|undefined;
	Operation: string;
}

export interface ItemViewOptionSortData {
	SortType: ItemSortBy;
	Reversed: boolean;
	Hidden: boolean;
}

export interface ItemViewOptionDataSource {
	DataSource: "Library"|"Tag";
	DataSourceKey: string;
}

export interface ItemViewOptionsData {
	Label: string;
	Key: string;
	DataSource: ItemViewOptionDataSource;
	Filters: ItemFilterData[];
	Sorts: ItemViewOptionSortData[];
}
