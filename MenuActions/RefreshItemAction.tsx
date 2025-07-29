import * as React from "react";
import { MenuAction } from "Common/MenuAction";
import { RefreshIcon } from "Common/RefreshIcon";

export const RefreshItemAction: MenuAction = {
	icon: (p) => <RefreshIcon {...p} />,
	textKey: "Refresh",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: () => { console.error("Missing Implementation"); },
}
