import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { EditIcon } from "CommonIcons/EditIcon";
import { ItemEditorService } from "Items/ItemEditorService";

export const EditItemAction: ItemMenuAction = {
	icon: (p) => <EditIcon {...p} />,
	textKey: "Edit",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: () => { ItemEditorService.Instance.IsEditing.Value = true; },
}
