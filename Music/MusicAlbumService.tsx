import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicAlbumIcon } from "Music/MusicAlbumIcon";
import { ImageShape } from "Items/ItemImage";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByPremiereDate } from "ItemList/ItemFilterTypes/FilterByPremiereDate";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByOfficialRating } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByPlayCount } from "ItemList/ItemSortTypes/SortByPlayCount";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";

export const MusicAlbumService: BaseItemKindService = {
	primaryShape: ImageShape.Square,
	findIcon: (props) => <MusicAlbumIcon {...props} />,
	findUrl: (item) => `/Music/Album/${item.Id}`,
	sortOptions: [
		SortByName,
		SortByDatePlayed,
		SortByDateCreated,
		SortByCommunityRating,
		SortByOfficialRating,
		SortByPremiereDate,
		SortByPlayCount,
		SortByRandom,
	],
	filterOptions: [
		FilterByName,
		FilterByIsFavorite,
		FilterByHasPlayed,
		FilterByPremiereDate,
	],
};
