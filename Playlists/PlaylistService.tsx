import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PlaylistIcon } from "Playlists/PlaylistIcon";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { CollectionTypeService } from "Collections/CollectionTypeService";

export const PlaylistService: BaseItemKindService = {
	kind: "Playlist",
	findIcon: (props) => <PlaylistIcon {...props} />,
	sortOptions: [
		SortByDateCreated,
	],
};

export const PlaylistCollectionService: CollectionTypeService = {
	type: "playlists",
	listUrl: (libraryId) => `/Playlists/${libraryId}`,
	findIcon: (props) => <PlaylistIcon {...props} />,
};
