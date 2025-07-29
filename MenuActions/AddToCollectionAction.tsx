import * as React from "react";
import { MenuAction } from "Common/MenuAction";
import { AddToCollectionIcon } from "Collections/AddToCollectionIcon";

export const AddToCollectionAction: MenuAction = {
	icon: (p) => <AddToCollectionIcon {...p} />,
	textKey: "AddToCollection",
	action: () => { console.error("Missing Implementation"); },
}
