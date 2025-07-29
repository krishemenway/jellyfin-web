import * as React from "react";
import { MenuAction } from "Common/MenuAction";
import { AddToPlaylistIcon } from "Playlists/AddToPlaylistIcon";

export const AddToPlaylistAction: MenuAction = {
	icon: (p) => <AddToPlaylistIcon {...p} />,
	textKey: "AddToPlaylist",
	action: () => { console.error("Missing Implementation"); },
}
