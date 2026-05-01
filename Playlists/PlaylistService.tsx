import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PlaylistIcon } from "Playlists/PlaylistIcon";

export const PlaylistService: BaseItemKindService = {
	kind: "Playlist",
	findIcon: (props) => <PlaylistIcon {...props} />,
	listUrl: (library) => `/Playlists/${library.Id}`,
};
