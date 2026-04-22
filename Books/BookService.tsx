import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { BookIcon } from "Books/BookIcon";
import { getItemsApi } from "node_modules/@jellyfin/sdk/lib/utils/api/items-api";
import { ServerService } from "Servers/ServerService";
import { BaseItemKind, ItemSortBy } from "node_modules/@jellyfin/sdk/lib/generated-client/models";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByProductionYear } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByOfficialRating } from "ItemList/ItemFilterTypes/FilterByOfficialRating";
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

export const BookService: BaseItemKindService = {
	findIcon: (props) => <BookIcon {...props} />,
	listUrl: (library) => `/Books/${library.Id}`,
	loadList: (a, libraryId) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: libraryId, fields: ["DateCreated"], sortBy: [ItemSortBy.SortName], recursive: true }, { signal: a.signal }).then((response) => response.data.Items ?? []),
	listTypes: [BaseItemKind.AudioBook, BaseItemKind.Book],
	filterOptions: [
		FilterByName,
		FilterByHasPlayed,
		FilterByContinueWatching,
		FilterByIsFavorite,
		FilterByProductionYear,
		FilterByStudio,
		FilterByTag,
		FilterByGenre,
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
