import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicVideoIcon } from "Music/MusicVideoIcon";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByProductionYear } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByTagCount } from "ItemList/ItemFilterTypes/FilterByTagCount";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByMissingField } from "ItemList/ItemFilterTypes/FilterByMissingField";
import { FilterByDuration } from "ItemList/ItemFilterTypes/FilterByDuration";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByOfficialRating } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByCriticRating } from "ItemList/ItemSortTypes/SortByCriticRating";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByPlayCount } from "ItemList/ItemSortTypes/SortByPlayCount";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByTagCount } from "ItemList/ItemSortTypes/SortByTagCount";

export const MusicVideoService: BaseItemKindService = {
	kind: "MusicVideo",
	findIcon: (props) => <MusicVideoIcon {...props} />,
	listUrl: (libraryId) => `/MusicVideos/${libraryId}`,
	nameWithContext: (item) => `${Nullable.StringValue(item.Artists?.join(", "), "", (artists) => artists + " - ")}${item.Name}`,
	playerSecondaryHeadline: (item) => [item.Album, item.ProductionYear?.toString()].coalesce("", Nullable.StringHasValue) + Nullable.StringValue(item.Artists?.join(", "), "", (artists) => " - " + artists),
	relevantPersonKinds: ["Actor", "Director", "Writer", "Producer", "Composer", "Editor"],
	filterOptions: [
		FilterByName,
		FilterByHasPlayed,
		FilterByContinueWatching,
		FilterByGenre,
		FilterByIsFavorite,
		FilterByProductionYear,
		FilterByStudio,
		FilterByTag,
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
