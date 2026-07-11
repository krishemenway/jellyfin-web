import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicArtistIcon } from "Music/MusicArtistIcon";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";

export const MusicArtistService: BaseItemKindService = {
	kind: "MusicArtist",
	findIcon: (props) => <MusicArtistIcon {...props} />,
	findUrl: (i) => `/Music/Artist/${i.Id}`,
	filterOptions: [
		FilterByName,
		FilterByIsFavorite,
		FilterByGenre,
	],
	sortOptions: [
		SortByDateCreated,
		SortByName,
		SortByRuntime,
	],
};
