import { ItemDataService } from "Items/ItemDataService";
import { ItemListService } from "ItemList/ItemListService";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";

export class ItemService {
	constructor() {
		this._itemDataByItemId = {};
		this._itemListByItemId = {};
	}

	public FindOrCreateItemData(id: string): ItemDataService {
		return this._itemDataByItemId[id] ?? (this._itemDataByItemId[id] = new ItemDataService(id));
	}

	public FindOrCreateItemList(libraryId: string, kind: BaseItemKind): ItemListService {
		return this._itemListByItemId[libraryId+kind] ?? (this._itemListByItemId[libraryId+kind] = new ItemListService(libraryId, kind));
	}

	private _itemDataByItemId: Record<string, ItemDataService>;
	private _itemListByItemId: Record<string, ItemListService>;

	static get Instance(): ItemService {
		return this._instance ?? (this._instance = new ItemService());
	}

	private static _instance: ItemService;
}
