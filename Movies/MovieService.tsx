import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MovieIcon } from "Movies/MovieIcon";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByCriticRating } from "ItemList/ItemSortTypes/SortByCriticRating";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";

export const MovieService: BaseItemKindService = {
	findIcon: (props) => <MovieIcon {...props} />,
	filterOptions: [
		FilterByName,
	],
	sortOptions: [
		SortByName,
		SortByRandom,
		SortByCommunityRating,
		SortByCriticRating,
		SortByDateCreated,
		SortByDatePlayed,
		SortByPremiereDate,
		SortByRuntime,
	],
};