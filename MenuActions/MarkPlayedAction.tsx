import * as React from "react";
import { MenuAction } from "Common/MenuAction";
import { ItemPlayedIcon } from "Items/ItemPlayedIcon";

export const MarkPlayedAction: MenuAction = {
	icon: (p) => <ItemPlayedIcon {...p} />,
	textKey: "MarkPlayed",
	action: () => { console.error("Missing Implementation"); },
}
