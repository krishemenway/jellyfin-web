import { BaseItemDto, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { ItemListViewOptions, ItemViewOptionsData } from "ItemList/ItemListViewOptions";
import { Observable } from "@residualeffect/reactor";
import { Settings } from "Users/SettingsStore";
import { BaseItemKindService } from "Items/BaseItemKindService";

export type LoadListByPromiseFunc = (abort: AbortController, id: string) => Promise<BaseItemDto[]>;

export class ItemListService {
	constructor(id: string) {
		this.Id = id;
		this.List = new Receiver("UnknownError");
		this.ListOptions = new Observable(null);
	}

	public LoadWithAbort(loadFunc?: LoadListByPromiseFunc): () => void {
		if (this.List.HasData.Value) {
			return () => { };
		}

		if (loadFunc !== undefined) {
			this.List.Start((a) => loadFunc(a, this.Id));
		} else {
			this.List.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: this.Id, fields: ["DateCreated", "Genres", "Tags", "SortName"], sortBy: [ItemSortBy.SortName] }, { signal: a.signal }).then((response) => response.data.Items ?? []));
		}

		return () => this.List.ResetIfLoading();
	}

	public LoadItemListViewOptionsOrNew(settings: Settings, itemKind: BaseItemKindService|null): void {
		const mostRecent = settings.Read(`MostRecentOption-${this.Id}`) ?? "Default";
		const allViewOptions = settings.ReadAsJson<ItemViewOptionsData[]>(`AllViewOptions-${this.Id}`, []) ?? [];
		const mostRecentOption = allViewOptions.find(x => x.Label === mostRecent);

		if (this.ListOptions.Value === null) {
			this.ListOptions.Value = new ItemListViewOptions(itemKind, mostRecentOption);
		}
	}

	public Id: string;
	public List: Receiver<BaseItemDto[]>;
	public ListOptions: Observable<ItemListViewOptions|null>;
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
