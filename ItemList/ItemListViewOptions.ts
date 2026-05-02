import { BaseItemDto, BaseItemKind, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByObjectsFunc, SortFuncs } from "Common/Sort";
import { EditableItemFilter } from "ItemList/EditableItemFilter";
import { CreateSortFunc, ItemSortOption } from "ItemList/ItemSortOption";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, ValueIsRequired } from "Common/EditableField";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";

export class ItemListViewOptions {
	constructor(itemKindService: BaseItemKindService, libraryId: string, key?: string, data?: ItemViewOptionsData, canSave?: boolean) {
		this.Key = key ?? self.crypto.randomUUID();
		this.LibraryId = libraryId;
		this.IsUnsaved = !Nullable.HasValue(data);
		this.CanSave = canSave ?? true;
		this.Label = new EditableField("Filter", Nullable.Value(data, "", (d) => d.Label), (v) => ValueIsRequired(v));
		this.ShowErrors = new Observable(false);

		this.ItemKindService = itemKindService;
		this.NewFilter = new Observable(undefined);
		this.Filters = new ObservableArray(Nullable.Value(data, [], (d) => d.Filters).map((d) => {
			const filterType = (itemKindService?.filterOptions ?? []).find((f) => f.type === d.FilterType);
			return new EditableItemFilter(filterType, d.FilterValue, d.Operation);
		}));

		this.SortBy = new ObservableArray(Nullable.Value(data, [], (d) => d.Sorts).map((d) => {
			const sort = (itemKindService?.sortOptions ?? []).find((s) => s.field === d.SortType);

			if (sort === undefined) {
				throw new Error(`Missing sort type ${d.SortType} from service ${itemKindService.kind}`);
			}

			return CreateSortFunc(sort, d.Reversed);
		}));

		this.FilterFunc = new Computed(() => (item) => this.Filters.Value.every((f) => f.ShowItem(item)))
		this.SortByFunc = new Computed(() => SortByObjectsFunc(this.SortBy.Value.concat([CreateSortFunc(SortByName, false)])));
	}

	public CreateNewFilter(filterOption: ItemFilterType): void {
		this.NewFilter.Value = new EditableItemFilter(filterOption);
	}

	public ClearNewFilter(): void {
		this.NewFilter.Value = undefined;
		this.ShowErrors.Value = false;
	}

	public AddSort(sortFunc: ItemSortOption, reversed: boolean): void {
		this.SortBy.unshift(CreateSortFunc(sortFunc, reversed));
	}

	public AddNewFilter(onAddedSuccessfully: () => void): void {
		const newFilter = this.NewFilter.Value!;

		if (newFilter.AllFields.every((f) => f.CanMakeRequest())) {
			this.Filters.push(newFilter);
			this.ClearNewFilter();
			onAddedSuccessfully();
		} else {
			this.ShowErrors.Value = true;
		}
	}

	public static CreateRecentlyAdded(service: BaseItemKindService, libraryId: string): ItemListViewOptions {
		return new ItemListViewOptions(service, libraryId, `RecentlyAdded-${libraryId}`, { Filters: [], Kind: service.kind, Label: "Recently Added", Sorts: [{ Reversed: true, SortType: "DateCreated" }] }, false);
	}

	public CreateSaveRequest(): ItemViewOptionsData {
		return {
			Label: this.Label.Current.Value,
			Kind: this.ItemKindService.kind,
			Filters: this.Filters.Value.map((i) => ({ FilterType: i.FilterType.type, FilterValue: i.FilterValue.Current.Value, Operation: i.Operation.Current.Value.Name })),
			Sorts: this.SortBy.Value.map((s) => ({ SortType: s.SortType, Reversed: s.Reversed }) as ItemViewOptionSortData),
		};
	}

	public BuildStorageKey(): string {
		return `ViewOption|${this.LibraryId}|${this.Key}`;
	}

	public Key: string;
	public LibraryId: string;
	public IsUnsaved: boolean;
	public CanSave: boolean;
	public Label: EditableField<string>;
	public ItemKindService: BaseItemKindService;
	public ShowErrors: Observable<boolean>;

	public NewFilter: Observable<EditableItemFilter|undefined>;

	public Filters: ObservableArray<EditableItemFilter>;
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
}

export interface ItemViewOptionsData {
	Kind: BaseItemKind;
	Label: string;
	Filters: ItemViewOptionFilterData[];
	Sorts: ItemViewOptionSortData[];
}
