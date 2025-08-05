import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { ItemPlayedIcon } from "Items/ItemPlayedIcon";

export const MarkPlayedAction: ItemMenuAction = {
	icon: (p) => <ItemPlayedIcon {...p} />,
	textKey: "MarkPlayed",
	action: () => { console.error("Missing Implementation"); },
}

export const MarkUnplayedAction: ItemMenuAction = {
	icon: (p) => <ItemPlayedIcon {...p} />,
	textKey: "MarkPlayed",
	action: () => { console.error("Missing Implementation"); },
}
