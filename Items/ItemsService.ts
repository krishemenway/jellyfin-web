import { ItemDataService } from "Items/ItemDataService";
import { ItemListService } from "ItemList/ItemListService";
import { ItemViewOptionDataSource } from "ItemList/ItemListViewOptions";
import { BaseItemKind } from "node_modules/@jellyfin/sdk/lib/generated-client/models";

export class ItemService {
	constructor() {
		this._itemDataByItemId = {};
		this._itemListByItemId = {};
	}

	public FindOrCreateItemData(id: string): ItemDataService {
		return this._itemDataByItemId[id] ?? (this._itemDataByItemId[id] = new ItemDataService(id));
	}

	public FindOrCreateListFromLibrary(libraryId: string, kind: BaseItemKind): ItemListService {
		const source: ItemViewOptionDataSource = {
			DataSource: "Library",
			DataSourceKey: `${kind}|${libraryId}`,
		};

		return this.FindOrCreateListFromSource(source);
	}

	public FindOrCreateListFromSource(dataSource: ItemViewOptionDataSource): ItemListService {
		const key = dataSource.DataSource + dataSource.DataSourceKey;
		return this._itemListByItemId[key] ?? (this._itemListByItemId[key] = new ItemListService(dataSource));
	}

	private _itemDataByItemId: Record<string, ItemDataService>;
	private _itemListByItemId: Record<string, ItemListService>;

	static get Instance(): ItemService {
		return this._instance ?? (this._instance = new ItemService());
	}

	private static _instance: ItemService;
}
