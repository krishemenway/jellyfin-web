import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { FavoriteIcon } from "CommonIcons/FavoriteIcon";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { ServerService } from "Servers/ServerService";
import { ItemCacheResetService } from "Items/ItemCacheResetService";

export const AddToFavoritesAction: ItemMenuAction = {
	icon: (p) => <FavoriteIcon {...p} />,
	textKey: "AddToFavorites",
	visible: (_, items) => items.some((i) => i.UserData?.IsFavorite !== true),
	action: (items, _, reloadItems) => {
		Promise.all(items.map((item) => getUserLibraryApi(ServerService.Instance.CurrentApi).markFavoriteItem({ itemId: item.Id ?? "", userId: ServerService.Instance.CurrentUserId.Value }))).then(() => {
			ItemCacheResetService.Instance.ResetItems(items);
			reloadItems();
		});
	},
};

export const RemoveFromFavoritesAction: ItemMenuAction = {
	icon: (p) => <FavoriteIcon {...p} />,
	textKey: "RemoveFromFavorites",
	visible: (_, items) => items.some((i) => i.UserData?.IsFavorite === true),
	action: (items, _, reloadItems) => {
		Promise.all(items.map((item) => getUserLibraryApi(ServerService.Instance.CurrentApi).unmarkFavoriteItem({ itemId: item.Id ?? "", userId: ServerService.Instance.CurrentUserId.Value }))).then(() => {
			ItemCacheResetService.Instance.ResetItems(items);
			reloadItems();
		});
	},
};
