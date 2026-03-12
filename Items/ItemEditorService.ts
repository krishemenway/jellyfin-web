import * as React from "react";
import { Observable } from "@residualeffect/reactor";
import { EditableItem } from "Items/EditableItem";
import { getItemUpdateApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Receiver } from "Common/Receiver";
import { useObservable } from "@residualeffect/rereactor";

export function useItemEditor(item: BaseItemDto): EditableItem|undefined {
	const editableItem = useObservable(ItemEditorService.Instance.CurrentEditableItem);
	React.useEffect(() => { ItemEditorService.Instance.CurrentEditableItem.Value = new EditableItem(item); }, [item]);

	return editableItem;
}

export class ItemEditorService {
	constructor() {
		this.CurrentEditableItem = new Observable(undefined);
		this.SaveResult = new Receiver("UnknownError");
		this.ShowErrors = new Observable(false);
		this.IsEditing = new Observable(false);
	}

	public Load(item: BaseItemDto): void {
		this.CurrentEditableItem.Value = new EditableItem(item);
		this.ShowErrors.Value = false;
	}

	public Save(): void {
		this.ShowErrors.Value = true;

		Nullable.TryExecute(this.CurrentEditableItem.Value, (editableItem) => {
			if (!editableItem.CanMakeRequest.Value) {
				return;
			}

			this.SaveResult.Start((a) => getItemUpdateApi(ServerService.Instance.CurrentApi).updateItem({ itemId: editableItem.From.Id!, baseItemDto: editableItem.CreateUpdateRequest(), }, { signal: a.signal }).then((response) => response.status === 200));
		});
	}

	public CurrentEditableItem: Observable<EditableItem|undefined>;
	public SaveResult: Receiver<boolean>;
	public ShowErrors: Observable<boolean>;
	public IsEditing: Observable<boolean>;

	static get Instance(): ItemEditorService {
		return this._instance ?? (this._instance = new ItemEditorService());
	}

	private static _instance: ItemEditorService;
}
