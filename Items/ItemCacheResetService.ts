import { Nullable } from "Common/MissingJavascriptFunctions";
import { IReceiver } from "Common/Receiver";
import { BaseItemDto } from "node_modules/@jellyfin/sdk/lib/generated-client/models";

export class ItemCacheResetService {
	constructor() {
		this._receiversByItemId = {};
	}

	public LoadedItems(items: BaseItemDto[], receiver: IReceiver): void {
		items.forEach((item) => {
			Nullable.TryExecute(this._receiversByItemId[item.Id!], (receivers) => {
				if (!receivers.includes(receiver)) {
					receivers.push(receiver)
				}
			}, () => {
				this._receiversByItemId[item.Id!] = [receiver];
			});
		});
	}

	public ResetItems(items: BaseItemDto[]): void {
		items.forEach((i) => this.ResetItem(i));
	}

	public ResetItem(item: BaseItemDto): void {
		this.ResetItemById(item.Id!);
	}

	private ResetItemById(id: string): void {
		Nullable.TryExecute(this._receiversByItemId[id], (receivers) => { receivers.forEach((r) => r.Reset()); });
	}

	private _receiversByItemId: Record<string, IReceiver[]>;

	static get Instance(): ItemCacheResetService {
		return this._instance ?? (this._instance = new ItemCacheResetService());
	}

	private static _instance: ItemCacheResetService;
}
