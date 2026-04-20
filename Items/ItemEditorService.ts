import * as React from "react";
import { Observable } from "@residualeffect/reactor";
import { EditableItem } from "Items/EditableItem";
import { getItemUpdateApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { BaseItemDto, MetadataEditorInfo, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Receiver } from "Common/Receiver";
import { useObservable } from "@residualeffect/rereactor";

export function useEditableItem(item: BaseItemDto, user: UserDto): EditableItem|undefined {
	if (!user.Policy?.IsAdministrator) {
		return undefined;
	}

	const editableItem = useObservable(ItemEditorService.Instance.CurrentEditableItem);
	React.useEffect(() => ItemEditorService.Instance.Load(item), [item]);

	return editableItem;
}

export class ItemEditorService {
	constructor() {
		this.CurrentEditableItem = new Observable(undefined);
		this.SaveResult = new Receiver("UnknownError");
		this.ShowErrors = new Observable(false);
		this.IsEditing = new Observable(false);
		this.MetadataInfo = new Receiver("UnknownError");
	}

	public Load(item: BaseItemDto): void {
		this.CurrentEditableItem.Value = new EditableItem(item);
		this.ShowErrors.Value = false;
		this.IsEditing.Value = false;
		this.MetadataInfo.Start((a) => getItemUpdateApi(ServerService.Instance.CurrentApi).getMetadataEditorInfo({ itemId: item.Id! }, { signal: a.signal }).then(response => response.data));
	}

	public Save(): void {
		this.ShowErrors.Value = true;

		Nullable.TryExecute(this.CurrentEditableItem.Value, (editableItem) => {
			if (!editableItem.CanMakeRequest.Value) {
				return;
			}

			this.SaveResult.Start((a) => getItemUpdateApi(ServerService.Instance.CurrentApi).updateItem({ itemId: editableItem.From.Id!, baseItemDto: editableItem.CreateUpdateRequest(), }, { signal: a.signal }).then((response) => {
				const wasSuccessful = response.status !== 200;
				
				if (wasSuccessful) {
					this.IsEditing.Value = false;
					this.CurrentEditableItem.Value?.OnSaved();
				}

				return wasSuccessful;
			}));
		});
	}

	public Cancel(): void {
		Nullable.TryExecute(this.CurrentEditableItem.Value, (item) => item.Revert());
		this.IsEditing.Value = false;
		this.ShowErrors.Value = false;
	}

	public CurrentEditableItem: Observable<EditableItem|undefined>;
	public SaveResult: Receiver<boolean>;
	public ShowErrors: Observable<boolean>;
	public IsEditing: Observable<boolean>;
	public MetadataInfo: Receiver<MetadataEditorInfo>;

	static get Instance(): ItemEditorService {
		return this._instance ?? (this._instance = new ItemEditorService());
	}

	private static _instance: ItemEditorService;
}
