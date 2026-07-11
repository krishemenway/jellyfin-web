import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { EditIcon } from "CommonIcons/EditIcon";

const manageLibraryActions: Record<string, ItemMenuAction> = {};

export function ManageLibraryAction(libraryId: string): ItemMenuAction {
	return manageLibraryActions[libraryId] ?? (manageLibraryActions[libraryId] = {
		icon: (p) => <EditIcon {...p} />,
		textKey: "ManageLibrary",
		visible: (user) => (user.Policy?.IsAdministrator ?? false),
		action: (_, navigate) => navigate(`/Library/${libraryId}`),
	});
}
