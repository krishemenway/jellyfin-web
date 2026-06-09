import { BaseItemDto, BaseItemKind, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { IReceiver, Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { ItemListViewOptions, ItemViewOptionDataSource, ItemViewOptionsData } from "ItemList/ItemListViewOptions";
import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { ItemCacheResetService } from "Items/ItemCacheResetService";

export interface ItemListStatConfig {
	Key: string;
	GetKeysForItem: (item: BaseItemDto) => (string|undefined|null)[];
}

export interface ItemListWithStats {
	List: BaseItemDto[];
	Stats: Record<string, Record<string, number>>;
}

const defaultLoadFunc = (a: AbortController, id: string) => (getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: id, fields: ["DateCreated", "Genres", "Tags", "SortName", "Studios"], sortBy: [ItemSortBy.SortName] }, { signal: a.signal }).then((r) => r.data.Items ?? []));
const loadRequestForDataSource = (dataSource: ItemViewOptionDataSource, receiver: IReceiver): (a: AbortController) => Promise<BaseItemDto[]> => {
	if (dataSource.DataSource === "Library") {
		const [kind, libraryId] = dataSource.DataSourceKey.split("|");
		const service = BaseItemKindServiceFactory.FindOrThrow(kind as BaseItemKind);
		const loadList = service.loadList ?? defaultLoadFunc;
		return (a: AbortController) => loadList(a, libraryId).then((list) => Nullable.Value(service.listTypes, list, (types) => list.filter((l) => types.indexOf(l.Type!) > -1))).then((items) => {
			ItemCacheResetService.Instance.LoadedItems(items, receiver);
			return items;
		});
	} else if (dataSource.DataSource === "Tag") {
		return (a: AbortController) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ recursive: true, tags: [dataSource.DataSourceKey], isMissing: false }, { signal: a.signal }).then((r) => r.data.Items ?? []).then((items) => {
			ItemCacheResetService.Instance.LoadedItems(items, receiver);
			return items;
		});
	} else {
		throw new Error(`Unknown data source ${dataSource.DataSource}`);
	}
}

export class ItemListService {
	constructor(dataSource: ItemViewOptionDataSource) {
		this.DataSource = dataSource;
		this.List = new Receiver("UnknownError");
		this.ListOptions = new Observable(new ItemListViewOptions(this.DataSource, undefined));
		this.ExistingOptions = new ObservableArray([]);
		this.ConfirmDeleteOptions = new Observable(null);
	}

	public LoadWithAbort(statConfigs?: ItemListStatConfig[]): () => void {
		if (this.List.HasData.Value) {
			return () => { };
		}

		this.List.Start((a) => loadRequestForDataSource(this.DataSource, this.List)(a).then(result => {
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

	public LoadItemListViewOptionsOrNew(settings: Settings, viewOptionsKey?: string): void {
		this.ExistingOptions.Value = settings.AllKeys().filter((k) => k.startsWith(`ViewOption|`)).map((key) => {
			const optionData = settings.ReadAsJsonOrThrow<ItemViewOptionsData>(key);

			if (optionData.DataSource.DataSource !== this.DataSource.DataSource || optionData.DataSource.DataSourceKey !== this.DataSource.DataSourceKey) {
				return undefined;
			}

			return new ItemListViewOptions(this.DataSource, optionData, true);
		}).filter((o) => o !== undefined).concat([
			ItemListViewOptions.CreateRecentlyAddedToLibrary(this.DataSource),
		]);

		if (Nullable.HasValue(viewOptionsKey)) {
			this.ListOptions.Value = Linq.First(this.ExistingOptions.Value, (o) => o.Key == viewOptionsKey) ?? new ItemListViewOptions(this.DataSource, undefined);
		} else {
			this.ListOptions.Value = new ItemListViewOptions(this.DataSource, undefined);
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

	public DataSource: ItemViewOptionDataSource;
	public List: Receiver<ItemListWithStats>;
	public ListOptions: Observable<ItemListViewOptions>;
	public ExistingOptions: ObservableArray<ItemListViewOptions>;
	public ConfirmDeleteOptions: Observable<ItemListViewOptions|null>;
}
