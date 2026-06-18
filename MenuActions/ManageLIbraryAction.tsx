import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { EditIcon } from "CommonIcons/EditIcon";

export const ManageLibraryAction: ItemMenuAction = {
	icon: (p) => <EditIcon {...p} />,
	textKey: "ManageLibrary",
	visible: (user, items) => (user.Policy?.IsAdministrator ?? false) && items.length === 1 && items[0].Type === "CollectionFolder",
	action: (items, navigate) => navigate(`/Library/${items[0].Id}`),
}
