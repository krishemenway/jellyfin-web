import { BaseItemDto, BaseItemKind, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { ItemListViewOptions, ItemViewOptionsData } from "ItemList/ItemListViewOptions";
import { Observable } from "@residualeffect/reactor";
import { Settings } from "Users/SettingsStore";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { Nullable } from "Common/MissingJavascriptFunctions";

export interface ItemListStatConfig {
	Key: string;
	GetKeysForItem: (item: BaseItemDto) => (string|undefined|null)[];
}

export interface ItemListWithStats {
	List: BaseItemDto[];
	Stats: Record<string, Record<string, number>>;
}

export class ItemListService {
	constructor(libraryId: string, itemKind: BaseItemKind) {
		this.LibraryId = libraryId;
		this.ItemKind = itemKind;
		this.List = new Receiver("UnknownError");
		this.ListOptions = new Observable(null);
		this.DefaultLoadItems = (a, id) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: id, fields: ["DateCreated", "Genres", "Tags", "SortName"], sortBy: [ItemSortBy.SortName] }, { signal: a.signal }).then((response) => response.data.Items ?? []);
	}

	public LoadWithAbort(statConfigs?: ItemListStatConfig[]): () => void {
		if (this.List.HasData.Value) {
			return () => { };
		}

		this.List.Start((a) => (BaseItemKindServiceFactory.FindOrNull(this.ItemKind)?.loadList ?? this.DefaultLoadItems)(a, this.LibraryId).then((result) => {
			return {
				List: result,
				Stats: result.reduce((stats, current) => {
					Nullable.TryExecute(statConfigs, (configs) => {
						configs.forEach((c) => {
							stats[c.Key] = stats[c.Key] ?? {};
							c.GetKeysForItem(current).forEach((itemKey) => {
								Nullable.TryExecute(itemKey, (k) => { stats[c.Key][k] = (stats[c.Key][k] ?? 0) + 1; });
							});
						});
					})

					return stats;
				}, {} as Record<string, Record<string, number>>),
			};
		}));

		return () => this.List.ResetIfLoading();
	}

	public LoadItemListViewOptionsOrNew(settings: Settings, itemKind: BaseItemKindService|null): void {
		const mostRecent = settings.Read(`MostRecentOption-${this.LibraryId}`) ?? "Default";
		const allViewOptions = settings.ReadAsJson<ItemViewOptionsData[]>(`AllViewOptions-${this.LibraryId}`, []) ?? [];
		const mostRecentOption = allViewOptions.find(x => x.Label === mostRecent);

		if (this.ListOptions.Value === null) {
			this.ListOptions.Value = new ItemListViewOptions(itemKind, mostRecentOption);
		}
	}

	public LibraryId: string;
	public ItemKind: BaseItemKind;
	public List: Receiver<ItemListWithStats>;
	public ListOptions: Observable<ItemListViewOptions|null>;
	private DefaultLoadItems: (a: AbortController, id: string) => Promise<BaseItemDto[]>;
}

export const RecentlyAddedViewOptions: ItemViewOptionsData = {
	Label: "Recently Added",
	Filters: [],
	Sorts: [{ SortType: "DateLastContentAdded", Reversed: true, }],
};

export const ContinueWatchingViewOptions: ItemViewOptionsData = {
	Label: "Continue Watching",
	Filters: [{ FilterType: "FilterByContinueWatching", FilterValue: "true" }],
	Sorts: [{ SortType: "DatePlayed", Reversed: true, }],
};

export const PresetViewOptions: ItemViewOptionsData[] = [
	RecentlyAddedViewOptions,
	ContinueWatchingViewOptions,
];
