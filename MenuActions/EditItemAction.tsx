import * as React from "react";
import { MenuAction } from "Common/MenuAction";
import { EditIcon } from "Common/EditIcon";

export const EditItemAction: MenuAction = {
	icon: (p) => <EditIcon {...p} />,
	textKey: "Edit",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: () => { console.error("Missing Implementation"); },
}
