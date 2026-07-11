import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicIcon } from "Music/MusicIcon";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { CollectionTypeService } from "Collections/CollectionTypeService";

export const AudioService: BaseItemKindService = {
	kind: "Audio",
	findIcon: (props) => <MusicIcon {...props} />,
	findUrl: (item) => `/Music/Album/${item.AlbumId}`,
	nameWithContext: (item) => `${item.AlbumArtist} - ${item.Name}`,
	sortOptions: [
		SortByDateCreated,
	],
};

export const MusicCollectionService : CollectionTypeService = {
	type: "music",
	listUrl: (libraryId) => `/Music/Artists/${libraryId}`,
	findIcon: (props) => <MusicIcon {...props} />,
};
