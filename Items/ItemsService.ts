import { ItemDataService } from "Items/ItemDataService";
import { ItemListService } from "ItemList/ItemListService";

export class ItemService {
	constructor() {
		this._itemDataByItemId = {};
		this._itemListByItemId = {};
	}

	public FindOrCreateItemData(id?: string): ItemDataService {
		if (id === undefined) {
			throw new Error("Missing id for loading");
		}

		return this._itemDataByItemId[id] ?? (this._itemDataByItemId[id] = new ItemDataService(id));
	}

	public FindOrCreateItemList(id?: string): ItemListService {
		if (id === undefined) {
			throw new Error("Missing id for loading");
		}

		return this._itemListByItemId[id] ?? (this._itemListByItemId[id] = new ItemListService(id));
	}

	private _itemDataByItemId: Record<string, ItemDataService>;
	private _itemListByItemId: Record<string, ItemListService>;

	static get Instance(): ItemService {
		return this._instance ?? (this._instance = new ItemService());
	}

	private static _instance: ItemService;
}
