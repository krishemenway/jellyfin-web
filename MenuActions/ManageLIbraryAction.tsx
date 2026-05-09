import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { EditIcon } from "CommonIcons/EditIcon";

export const ManageLibraryAction: ItemMenuAction = {
	icon: (p) => <EditIcon {...p} />,
	textKey: "ManageLibrary",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: (items, navigate) => navigate(`/Library/${items[0].Id}`),
}
