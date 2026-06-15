import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByObjectsFunc } from "Common/Sort";
import { CreateSortFunc, ItemSortType } from "ItemList/ItemSortType";
import { IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, IEditableField, ValueIsRequired } from "Common/EditableField";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { ItemSortTypeStore } from "ItemList/ItemSortOptionStore";
import { ItemFilterTypeStore, ItemFilterData } from "ItemList/ItemFilterTypeStore";
import { ItemSortTypeModel } from "ItemList/ItemSortTypeModel";

export class ItemListViewOptions {
	constructor(dataSource: ItemViewOptionDataSource, data?: ItemViewOptionsData, canSave?: boolean) {
		this.Key = Nullable.Value(data?.Key, self.crypto.randomUUID(), k => k);
		this.IsUnsaved = !Nullable.HasValue(data);
		this.CanSave = canSave ?? true;
		this.Label = new EditableField("Filter", Nullable.Value(data, "", (d) => d.Label), (v) => ValueIsRequired(v));
		this.ShowErrors = new Observable(false);
		this.DataSource = data?.DataSource ?? dataSource;
		this.HasChanged = new Computed(() => this.AllFields().map((f) => f.HasChanged.Value).some((hc) => hc));

		this.NewFilter = new Observable(undefined);
		this.Filters = new ObservableArray(Nullable.Value(data, [], (d) => d.Filters).map((d) => ItemFilterTypeStore.Instance.FindOrThrow(d.Type).CreateModel(d)));
		this.FilterKeys = new EditableField<string[]>("FilterKeys", this.Filters.Value.map((f) => f.Key));

		this.SortBy = new ObservableArray(Nullable.Value(data, [], (d) => d.Sorts).map(d => new ItemSortTypeModel(ItemSortTypeStore.Instance.FindOrThrow(d.SortType), d)));
		this.SortKeys = new EditableField<string[]>("SortKeys", this.SortBy.Value.map(s => s.Key));

		this.FilterFunc = new Computed(() => (item) => this.Filters.Value.every(f => f.Filter.Value(item)))
		this.SortByFunc = new Computed(() => SortByObjectsFunc(this.SortBy.Value.map((sb) => sb.SortFunc.Value).concat([CreateSortFunc(SortByName, false)])));
	}

	public OnSaved(): void {
		this.AllFields().forEach((f) => f.OnSaved());
	}

	public CreateNewFilter(filterOption: ItemFilterType): void {
		this.NewFilter.Value = filterOption.CreateModel();
	}

	public RemoveFilter(filter: IFilterModel): void {
		this.FilterKeys.OnChange(this.FilterKeys.Current.Value.filter((k) => k !== filter.Key));
		this.Filters.remove(filter);
	}

	public RemoveSort(sort: ItemSortTypeModel): void {
		this.SortKeys.OnChange(this.SortKeys.Current.Value.filter((k) => k !== sort.Key));
		this.SortBy.remove(sort);
	}

	public ClearNewFilter(): void {
		this.NewFilter.Value = undefined;
		this.ShowErrors.Value = false;
	}

	public AddSort(sortType: ItemSortType): void {
		this.SortBy.unshift(new ItemSortTypeModel(sortType));
	}

	public AddNewFilter(onAddedSuccessfully: () => void): void {
		const newFilter = this.NewFilter.Value!;

		if (newFilter.AllFields.Value.every((f) => f.CanMakeRequest())) {
			this.Filters.push(newFilter);
			this.FilterKeys.OnChange(this.Filters.Value.map((f) => f.Key));
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
			Sorts: this.SortBy.Value.map((s) => s.CreateRequest()),
		};
	}

	public BuildStorageKey(): string {
		return `ViewOption|${this.Key}`;
	}

	private AllFields(): IEditableField[] {
		const allFieldsFromFilters = Linq.SelectMany(this.Filters.Value.map((f) => f.AllFields.Value), (f) => f);
		const allFieldsFromSorts = Linq.SelectMany(this.SortBy.Value.map((f) => f.AllFields.Value), (f) => f);
		const fields: IEditableField[] = [
			this.Label,
			this.FilterKeys,
			this.SortKeys,
		];

		return fields.concat(allFieldsFromFilters).concat(allFieldsFromSorts);
	}

	public Key: string;
	public IsUnsaved: boolean;
	public CanSave: boolean;
	public Label: EditableField<string>;
	public ShowErrors: Observable<boolean>;
	public HasChanged: Computed<boolean>;
	public DataSource: ItemViewOptionDataSource;

	public NewFilter: Observable<IFilterModel|undefined>;

	public Filters: ObservableArray<IFilterModel>;
	public FilterKeys: EditableField<string[]>;

	public SortBy: ObservableArray<ItemSortTypeModel>;
	public SortKeys: EditableField<string[]>;

	public FilterFunc: Computed<(item: BaseItemDto) => boolean>;
	public SortByFunc: Computed<(a: BaseItemDto, b: BaseItemDto) => number>;
}

export interface ItemViewOptionFilterData {
	FilterType: string;
	FilterValue: string|undefined;
	Operation: string;
}

export interface ItemViewOptionSortData {
	SortType: string;
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
