import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { ShowIcon } from "Shows/ShowIcon";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByProductionYear } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByHasSubtitles } from "ItemList/ItemFilterTypes/FilterByHasSubtitles";
import { FilterByOfficialRating } from "ItemList/ItemFilterTypes/FilterByOfficialRating";
import { FilterByHasEnded } from "ItemList/ItemFilterTypes/FilterByHasEnded";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByCriticRating } from "ItemList/ItemSortTypes/SortByCriticRating";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByOfficialRating } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByProductionYear } from "ItemList/ItemSortTypes/SortByProductionYear";
import { SortByTagCount } from "ItemList/ItemSortTypes/SortByTagCount";

export const ShowService: BaseItemKindService = {
	kind: "Series",
	findIcon: (props) => <ShowIcon {...props} />,
	findUrl: (item) => `/Show/${item.Id}`,
	listUrl: (libraryId) => `/Shows/${libraryId}`,
	relevantPersonKinds: ["Actor", "Director", "Writer", "GuestStar", "Producer", "Editor"],
	filterOptions: [
		FilterByName,
		FilterByGenre,
		FilterByHasPlayed,
		FilterByStudio,
		FilterByTag,
		FilterByContinueWatching,
		FilterByProductionYear,
		FilterByIsFavorite,
		FilterByHasEnded,
		FilterByHasSubtitles,
		FilterByOfficialRating,
	],
	sortOptions: [
		SortByName,
		SortByDateCreated,
		SortByCommunityRating,
		SortByCriticRating,
		SortByRandom,
		SortByOfficialRating,
		SortByPremiereDate,
		SortByProductionYear,
		SortByTagCount,
	],
};
