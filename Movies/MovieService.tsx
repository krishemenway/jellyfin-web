import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MovieIcon } from "Movies/MovieIcon";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByPremiereDate } from "ItemList/ItemFilterTypes/FilterByPremiereDate";
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
import { ImageShape } from "Items/ItemImage";
import { RefreshItemAction } from "MenuActions/RefreshItemAction";
import { RenameLibraryAction } from "MenuActions/RenameLibraryAction";
import { EditItemAction } from "MenuActions/EditItemAction";

export const MovieService: BaseItemKindService = {
	primaryShape: ImageShape.Portrait,
	searchResultName: (item) => `${item.Name} (${item.ProductionYear})`,
	findIcon: (props) => <MovieIcon {...props} />,
	listActions: [
		[
			EditItemAction,
			RefreshItemAction,
			RenameLibraryAction,
		],
	],
	filterOptions: [
		FilterByName,
		FilterByHasPlayed,
		FilterByContinueWatching,
		FilterByIsFavorite,
		FilterByPremiereDate,
		FilterByStudio,
		FilterByTag,
		FilterByGenre,
	],
	sortOptions: [
		SortByName,
		SortByRandom,
		SortByCommunityRating,
		SortByOfficialRating,
		SortByCriticRating,
		SortByDateCreated,
		SortByDatePlayed,
		SortByPlayCount,
		SortByPremiereDate,
		SortByRuntime,
	],
};