import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PlaylistIcon } from "Playlists/PlaylistIcon";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";

export const PlaylistService: BaseItemKindService = {
	kind: "Playlist",
	findIcon: (props) => <PlaylistIcon {...props} />,
	listUrl: (libraryId) => `/Playlists/${libraryId}`,
	sortOptions: [
		SortByDateCreated,
	],
};
