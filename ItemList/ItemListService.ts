import { BaseItemDto, BaseItemKind, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Settings, SettingsStore } from "Users/SettingsStore";
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
		this.ExistingOptions = new ObservableArray([]);
		this.ConfirmDeleteOptions = new Observable(null);

		this.DefaultLoadItems = (a, id) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: id, fields: ["DateCreated", "Genres", "Tags", "SortName", "Studios"], sortBy: [ItemSortBy.SortName] }, { signal: a.signal }).then((response) => response.data.Items ?? []);
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

	public LoadItemListViewOptionsOrNew(settings: Settings, itemKind: BaseItemKindService, viewOptionsKey?: string): void {
		this.ExistingOptions.Value = settings.AllKeys().filter((k) => k.startsWith(`ViewOption|${this.LibraryId}`)).map((key) => new ItemListViewOptions(itemKind, this.LibraryId, key.split("|")[2], settings.ReadAsJson(key))).concat([
			ItemListViewOptions.CreateRecentlyAdded(itemKind, this.LibraryId),
		]);

		if (Nullable.HasValue(viewOptionsKey)) {
			this.ListOptions.Value = this.ExistingOptions.Value.filter((o) => o.Key == viewOptionsKey)[0] ?? new ItemListViewOptions(itemKind, this.LibraryId);
		} else {
			this.ListOptions.Value = new ItemListViewOptions(itemKind, this.LibraryId);
		}
	}

	public SaveViewOptions(settings: Settings, listOptions: ItemListViewOptions, onSuccess: (viewOptionsKey: string|null) => void): void {
		listOptions.ShowErrors.Value = true;

		SettingsStore.Instance.SaveSettings("usersettings", settings.CreateSaveRequestWithChangedKey(listOptions.BuildStorageKey(), listOptions.CreateSaveRequest()), () => {
			SettingsStore.Instance.LoadSettings("usersettings", () => {
				if (!this.ExistingOptions.Value.includes(listOptions)) {
					listOptions.Label.OnSaved();
					this.ExistingOptions.push(listOptions);
				}

				listOptions.ShowErrors.Value = false;
				onSuccess(listOptions.IsUnsaved ? listOptions.Key : null);
			});
		});
	}

	public RemoveViewOptions(settings: Settings, listOptions: ItemListViewOptions, onSuccess: () => void): void {
		SettingsStore.Instance.SaveSettings("usersettings", settings.CreateSaveRequestWithRemovedKey(listOptions.Key), () => {
			SettingsStore.Instance.LoadSettings("usersettings", () => {
				this.ExistingOptions.remove(listOptions);
				onSuccess();
			});
		});
	}

	public LibraryId: string;
	public ItemKind: BaseItemKind;
	public List: Receiver<ItemListWithStats>;
	public ListOptions: Observable<ItemListViewOptions|null>;
	public ExistingOptions: ObservableArray<ItemListViewOptions>;
	public ConfirmDeleteOptions: Observable<ItemListViewOptions|null>;

	private DefaultLoadItems: (a: AbortController, id: string) => Promise<BaseItemDto[]>;
}
