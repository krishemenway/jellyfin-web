import * as React from "react";
import { MenuAction } from "Common/MenuAction";
import { EditIcon } from "CommonIcons/EditIcon";

export const ManageLibraryAction: MenuAction = {
	icon: (p) => <EditIcon {...p} />,
	textKey: "ManageLibrary",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: () => { console.error("Missing Implementation"); },
}
