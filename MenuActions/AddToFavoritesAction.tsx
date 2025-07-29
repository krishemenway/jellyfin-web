import * as React from "react";
import { MenuAction } from "Common/MenuAction";
import { ItemFavoriteIcon } from "Items/ItemFavoriteIcon";

export const AddToFavoritesAction: MenuAction = {
	icon: (p) => <ItemFavoriteIcon {...p} />,
	textKey: "AddToFavorites",
	action: () => { console.error("Missing Implementation"); },
}
