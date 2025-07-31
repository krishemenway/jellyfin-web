import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { ShowIcon } from "Shows/ShowIcon";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByPremiereDate } from "ItemList/ItemFilterTypes/FilterByPremiereDate";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByHasSubtitles } from "ItemList/ItemFilterTypes/FilterByHasSubtitles";
import { FilterByOfficialRating } from "ItemList/ItemFilterTypes/FilterByOfficialRating";
import { FilterBySeriesStatus } from "ItemList/ItemFilterTypes/FilterBySeriesStatus";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByCriticRating } from "ItemList/ItemSortTypes/SortByCriticRating";
import { RefreshItemAction } from "MenuActions/RefreshItemAction";
import { RenameLibraryAction } from "MenuActions/RenameLibraryAction";
import { ManageLibraryAction } from "MenuActions/ManageLIbraryAction";

export const ShowService: BaseItemKindService = {
	findIcon: (props) => <ShowIcon {...props} />,
	findUrl: (item) => `/Show/${item.Id}`,
	listActions: [
		[
			ManageLibraryAction,
			RefreshItemAction,
			RenameLibraryAction,
		],
	],
	sortOptions: [
		SortByName,
		SortByDateCreated,
		SortByCommunityRating,
		SortByCriticRating,
	],
	filterOptions: [
		FilterByName,
		FilterByGenre,
		FilterByHasPlayed,
		FilterByStudio,
		FilterByTag,
		FilterByContinueWatching,
		FilterByPremiereDate,
		FilterByIsFavorite,
		FilterBySeriesStatus,
		FilterByHasSubtitles,
		FilterByOfficialRating,
	]
};
