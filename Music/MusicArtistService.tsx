import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicArtistIcon } from "Music/MusicArtistIcon";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
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
	loadList: (a, id) => getArtistsApi(ServerService.Instance.CurrentApi).getArtists({ parentId: id, fields: [ "Genres" ] }, { signal: a.signal }).then((result) => result.data.Items ?? []),
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
