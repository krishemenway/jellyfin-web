import * as React from "react";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { ItemPlayedIcon } from "Items/ItemPlayedIcon";
import { ServerService } from "Servers/ServerService";
import { ItemCacheResetService } from "Items/ItemCacheResetService";
import { RevertIcon } from "CommonIcons/RevertIcon";

export const MarkPlayedAction: ItemMenuAction = {
	icon: (p) => <ItemPlayedIcon {...p} />,
	textKey: "MarkPlayed",
	visible: (_, items) => items.some((i) => i.UserData?.Played !== true) && items.some((i) => i.Type !== "CollectionFolder"),
	action: (items, _, reloadItems) => {
		Promise.all(items.map((item) => getPlaystateApi(ServerService.Instance.CurrentApi).markPlayedItem({ itemId: item.Id!, userId: ServerService.Instance.CurrentUserId.Value }))).then(() => {
			ItemCacheResetService.Instance.ResetItems(items);
			reloadItems();
		});
	},
};

export const MarkUnplayedAction: ItemMenuAction = {
	icon: (p) => <RevertIcon {...p} />,
	textKey: "MarkUnplayed",
	visible: (_, items) => items.some((i) => i.UserData?.Played === true),
	action: (items, _, reloadItems) => {
		Promise.all(items.map((item) => getPlaystateApi(ServerService.Instance.CurrentApi).markUnplayedItem({ itemId: item.Id!, userId: ServerService.Instance.CurrentUserId.Value }))).then(() => {
			ItemCacheResetService.Instance.ResetItems(items);
			reloadItems();
		});
	},
};
