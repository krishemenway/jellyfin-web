import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MovieIcon } from "Movies/MovieIcon";
import { ImageShape } from "Items/ItemImage";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByProductionYear } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByTagCount } from "ItemList/ItemFilterTypes/FilterByTagCount";
import { FilterByMissingField } from "ItemList/ItemFilterTypes/FilterByMissingField";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByCriticRating } from "ItemList/ItemSortTypes/SortByCriticRating";
import { SortByOfficialRating } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByPlayCount } from "ItemList/ItemSortTypes/SortByPlayCount";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByTagCount } from "ItemList/ItemSortTypes/SortByTagCount";
import { FilterByDuration } from "ItemList/ItemFilterTypes/FilterByDuration";

export const MovieService: BaseItemKindService = {
	kind: "Movie",
	primaryShape: ImageShape.Portrait,
	nameWithContext: (item) => `${item.Name} (${item.ProductionYear})`,
	relevantPersonKinds: ["Actor", "Director", "Writer", "Producer", "Editor"],
	findIcon: (props) => <MovieIcon {...props} />,
	listUrl: (libraryId) => `/Movies/${libraryId}`,
	filterOptions: [
		FilterByName,
		FilterByHasPlayed,
		FilterByContinueWatching,
		FilterByIsFavorite,
		FilterByProductionYear,
		FilterByStudio,
		FilterByTag,
		FilterByGenre,
		FilterByTagCount,
		FilterByMissingField,
		FilterByDuration,
	],
	sortOptions: [
		SortByName,
		SortByCommunityRating,
		SortByOfficialRating,
		SortByCriticRating,
		SortByDateCreated,
		SortByDatePlayed,
		SortByPlayCount,
		SortByPremiereDate,
		SortByRuntime,
		SortByRandom,
		SortByTagCount,
	],
};