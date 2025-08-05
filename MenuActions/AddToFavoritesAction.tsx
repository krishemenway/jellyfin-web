import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { ItemFavoriteIcon } from "Items/ItemFavoriteIcon";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { ServerService } from "Servers/ServerService";
import { Linq } from "Common/MissingJavascriptFunctions";

export const AddToFavoritesAction: ItemMenuAction = {
	icon: (p) => <ItemFavoriteIcon {...p} />,
	textKey: "AddToFavorites",
	action: (items) => {
		const item = Linq.Single(items, () => true);
		getUserLibraryApi(ServerService.Instance.CurrentApi).markFavoriteItem({ itemId: item.Id ?? "", userId: ServerService.Instance.CurrentUserId });
	},
};
