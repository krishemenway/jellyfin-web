import { BaseItemDto, CollectionType, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { getArtistsApi, getItemsApi, getStudiosApi, getTvShowsApi } from "@jellyfin/sdk/lib/utils/api";
import { IReceiver, Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { ItemListViewOptions, ItemViewOptionDataSource, ItemViewOptionsData } from "ItemList/ItemListViewOptions";
import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemCacheResetService } from "Items/ItemCacheResetService";
import { CollectionServiceFactory } from "Collections/CollectionTypeService";

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
	switch(dataSource.DataSource) {
		case "Tag":
			return (a: AbortController) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ recursive: true, tags: [dataSource.DataSourceKey], isMissing: false }, { signal: a.signal }).then((r) => r.data.Items ?? []).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		case "Resume":
			return (a: AbortController) => Promise.all([getItemsApi(ServerService.Instance.CurrentApi).getResumeItems({ }, { signal: a.signal }), getTvShowsApi(ServerService.Instance.CurrentApi).getNextUp({ })]).then(([resume, nextUp]) => (resume.data.Items ?? []).concat(nextUp.data.Items ?? []).distinct((i) => i.Id!)).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		case "Genre":
			return (a: AbortController) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ recursive: true, genres: [dataSource.DataSourceKey] }, { signal: a.signal }).then((r) => r.data.Items ?? []).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		case "Studios":
			return (a: AbortController) => getStudiosApi(ServerService.Instance.CurrentApi).getStudios({ parentId: dataSource.DataSourceKey }, { signal: a.signal }).then((r) => r.data.Items ?? []).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		case "Studio":
			return (a: AbortController) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ recursive: true, studioIds: [dataSource.DataSourceKey] }, { signal: a.signal }).then((r) => r.data.Items ?? []).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		case "Collection":
			return (a: AbortController) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ recursive: true, parentId: dataSource.DataSourceKey }, { signal: a.signal }).then((r) => r.data.Items ?? []).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		case "MusicArtists":
			return (a: AbortController) => getArtistsApi(ServerService.Instance.CurrentApi).getArtists({ parentId: dataSource.DataSourceKey, fields: [ "Genres" ] }, { signal: a.signal }).then((result) => result.data.Items ?? []).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		case "MusicSongs": {
			const BatchSize = 1000;
			return (a: AbortController) => new Promise((onResolved, onFailure) => {
				const allItems: BaseItemDto[] = [];
				getItemsApi(ServerService.Instance.CurrentApi).getItems({ limit: BatchSize, startIndex: 0, parentId: dataSource.DataSourceKey, enableTotalRecordCount: true, recursive: true, includeItemTypes: ["Audio"], fields: ["DateCreated", "Genres", "Tags"], sortBy: [ItemSortBy.SortName] }, { signal: a.signal })
					.then(async (initialResult) => {
						if (!Nullable.HasValue(initialResult.data.TotalRecordCount) || initialResult.data.TotalRecordCount === 0) {
							onResolved([]);
							return;
						}

						allItems.push(...initialResult.data.Items ?? [])
						const totalBatches = Math.ceil(initialResult.data.TotalRecordCount / BatchSize);

						for (let batchIndex = 1; batchIndex < totalBatches; batchIndex++) {
							await getItemsApi(ServerService.Instance.CurrentApi).getItems({ limit: BatchSize, startIndex: BatchSize * batchIndex, parentId: dataSource.DataSourceKey, recursive: true, includeItemTypes: ["Audio"], fields: ["DateCreated", "Genres", "Tags"], sortBy: [ItemSortBy.SortName] }, { signal: a.signal })
									.then((r) => allItems.push(...r.data.Items ?? []))
									.catch(onFailure);
						}

						onResolved(allItems);
					})
					.catch(onFailure);
			});
		}
		default: {
			const service = CollectionServiceFactory.FindOrNullByCollectionType(dataSource.DataSource as CollectionType);
			const loadList = service?.loadList ?? defaultLoadFunc;

			return (a: AbortController) => loadList(a, dataSource.DataSourceKey).then((list) => Nullable.Value(service?.listTypes, list, (types) => list.filter((l) => types.indexOf(l.Type!) > -1))).then((items) => {
				ItemCacheResetService.Instance.LoadedItems(items, receiver);
				return items;
			});
		}
	}
}

export class ItemListService {
	constructor(dataSource: ItemViewOptionDataSource) {
		this.DataSource = dataSource;
		this.List = new Receiver("UnknownError");
		this.ListOptions = new Observable(new ItemListViewOptions(this.DataSource, undefined));
		this.ExistingOptions = new ObservableArray([]);
		this.ConfirmDeleteOptions = new Observable(null);

		this.SelectedItems = new ObservableArray([]);
		this.SelectModeEnabled = new Observable(false);
	}

	public ToggleSelectMode(): void {
		this.SelectModeEnabled.Value = !this.SelectModeEnabled.Value;
		this.SelectedItems.clear();
	}

	public LoadWithAbort(statConfigs?: ItemListStatConfig[], forceRefresh?: boolean): () => void {
		if (this.List.HasData.Value && forceRefresh !== true) {
			return () => { };
		}

		this.SelectedItems.clear();
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
		}), forceRefresh === true);

		return () => this.List.ResetIfLoading();
	}

	public LoadItemListViewOptionsOrNew(settings: Settings, viewOptionsKey: string|undefined, contextName: string, dataForNew?: Partial<ItemViewOptionsData>): void {
		this.ExistingOptions.Value = settings.AllKeys()
			.filter((k) => k.startsWith(`ViewOption|`))
			.map((key) => settings.ReadAsJsonOrThrow<ItemViewOptionsData>(key))
			.filter((optionData) => optionData.DataSource.DataSource === this.DataSource.DataSource && optionData.DataSource.DataSourceKey === this.DataSource.DataSourceKey)
			.map((optionData) => new ItemListViewOptions(this.DataSource, optionData, false))
			.concat([ ItemListViewOptions.CreateRecentlyAdded(this.DataSource, contextName) ]);

		if (Nullable.HasValue(viewOptionsKey)) {
			this.ListOptions.Value = this.ExistingOptions.Value.first((o) => o.Key == viewOptionsKey) ?? new ItemListViewOptions(this.DataSource, dataForNew);
		} else {
			this.ListOptions.Value = new ItemListViewOptions(this.DataSource, dataForNew);
		}
	}

	public SaveViewOptions(settings: Settings, listOptions: ItemListViewOptions, onSuccess: (viewOptionsKey: string|null) => void): void {
		listOptions.ShowErrors.Value = true;

		if (listOptions.IsReadOnly || !listOptions.CanMakeRequest.Value) {
			return;
		}

		SettingsStore.Instance.SaveSettings("usersettings", settings.CreateSaveRequestWithChangedKey(listOptions.BuildStorageKey(), listOptions.CreateSaveRequest()), () => {
			SettingsStore.Instance.LoadSettings("usersettings", () => {
				if (!this.ExistingOptions.Value.includes(listOptions)) {
					listOptions.OnSaved();
					this.ExistingOptions.push(listOptions);
				}

				listOptions.ShowErrors.Value = false;
				onSuccess(listOptions.IsUnsaved ? listOptions.Key : null);
			});
		});
	}

	public RemoveViewOptions(settings: Settings, listOptions: ItemListViewOptions, onSuccess: () => void): void {
		SettingsStore.Instance.SaveSettings("usersettings", settings.CreateSaveRequestWithRemovedKey(listOptions.BuildStorageKey()), () => {
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

	public SelectedItems: ObservableArray<BaseItemDto>;
	public SelectModeEnabled: Observable<boolean>;
}
