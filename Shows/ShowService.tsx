import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { TVIcon } from "Shows/TVIcon";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByPremiereDate } from "ItemList/ItemFilterTypes/FilterByPremiereDate";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByHasSubtitles } from "ItemList/ItemFilterTypes/FilterByHasSubtitles";

export const ShowService: BaseItemKindService = {
	findIcon: (props) => <TVIcon {...props} />,
	findUrl: (item) => `/Show/${item.Id}`,
	filterOptions: [
		FilterByName,
		FilterByGenre,
		FilterByHasPlayed,
		FilterByStudio,
		FilterByTag,
		FilterByContinueWatching,
		FilterByPremiereDate,
		FilterByIsFavorite,
		// FilterBySeriesStatus,
		FilterByHasSubtitles,
		// FilterByOfficialRating,
	]
};
