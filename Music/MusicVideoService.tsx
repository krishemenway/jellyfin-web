import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicVideoIcon } from "Music/MusicVideoIcon";
import { ManageLibraryAction } from "MenuActions/ManageLIbraryAction";
import { RefreshItemAction } from "MenuActions/RefreshItemAction";
import { RenameLibraryAction } from "MenuActions/RenameLibraryAction";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByProductionYear } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByOfficialRating } from "ItemList/ItemFilterTypes/FilterByOfficialRating";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
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

export const MusicVideoService: BaseItemKindService = {
	findIcon: (props) => <MusicVideoIcon {...props} />,
	listUrl: (library) => `/MusicVideos/${library.Id}`,
	listActions: [
		[
			ManageLibraryAction,
			RefreshItemAction,
			RenameLibraryAction,
		],
	],
	filterOptions: [
		FilterByName,
		FilterByHasPlayed,
		FilterByContinueWatching,
		FilterByGenre,
		FilterByIsFavorite,
		FilterByProductionYear,
		FilterByStudio,
		FilterByTag,
		FilterByOfficialRating,
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
	],
};
