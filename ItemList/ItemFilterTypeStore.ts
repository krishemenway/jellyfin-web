import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { FilterByContinueWatching, FilterByContinueWatchingData } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByGenre, FilterByGenreData } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByHasEnded, FilterByHasEndedData } from "ItemList/ItemFilterTypes/FilterByHasEnded";
import { FilterByHasPlayed, FilterByHasPlayedData } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByIsFavorite, FilterByIsFavoriteData } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByName, FilterByNameData } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByProductionYear, FilterByProductionYearData } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByStudio, FilterByStudioData } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag, FilterByTagData } from "ItemList/ItemFilterTypes/FilterByTag";
import { FilterByType, FilterByTypeData } from "ItemList/ItemFilterTypes/FilterByType";
import { FilterByTagCount, FilterByTagCountData } from "ItemList/ItemFilterTypes/FilterByTagCount";
import { FilterByMissingField, FilterByMissingFieldData } from "ItemList/ItemFilterTypes/FilterByMissingField";
import { FilterByDuration, FilterByDurationData } from "ItemList/ItemFilterTypes/FilterByDuration";

export type ItemFilterData = 
	FilterByTypeData
	| FilterByTagData
	| FilterByGenreData
	| FilterByStudioData
	| FilterByProductionYearData
	| FilterByContinueWatchingData
	| FilterByHasPlayedData
	| FilterByHasEndedData
	| FilterByIsFavoriteData
	| FilterByNameData
	| FilterByTagCountData
	| FilterByMissingFieldData
	| FilterByDurationData;

export class ItemFilterTypeStore {
	public FindOrThrow(filterType: string): ItemFilterType {
		const found = this._filterTypes[filterType];

		if (!Nullable.HasValue(found)) {
			throw new Error(`Unknown filter type ${filterType}`);
		}

		return found;
	}

	private _filterTypes: Record<string, ItemFilterType> = [
		FilterByType,
		FilterByTag,
		FilterByGenre,
		FilterByStudio,
		FilterByProductionYear,
		FilterByContinueWatching,
		FilterByHasPlayed,
		FilterByHasEnded,
		FilterByIsFavorite,
		FilterByName,
		FilterByTagCount,
		FilterByMissingField,
		FilterByDuration,
	].toRecord((t) => t.FilterType);
	
	static get Instance(): ItemFilterTypeStore {
		return this._instance ?? (this._instance = new ItemFilterTypeStore());
	}

	private static _instance: ItemFilterTypeStore;
}
