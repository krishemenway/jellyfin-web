import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByHasEnded } from "ItemList/ItemFilterTypes/FilterByHasEnded";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByHasSubtitles } from "ItemList/ItemFilterTypes/FilterByHasSubtitles";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByOfficialRating } from "ItemList/ItemFilterTypes/FilterByOfficialRating";
import { FilterByProductionYear } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";

export class ItemFilterTypeStore {
	public FindOrThrow(filterType: string): ItemFilterType {
		const found = this._filterTypes[filterType];

		if (!Nullable.HasValue(found)) {
			throw new Error(`Unknown filter type ${filterType}`);
		}

		return found;
	}

	private _filterTypes: Record<string, ItemFilterType> = Linq.ToRecord([
		FilterByContinueWatching,
		FilterByGenre,
		FilterByHasEnded,
		FilterByHasPlayed,
		FilterByHasSubtitles,
		FilterByIsFavorite,
		FilterByName,
		FilterByOfficialRating,
		FilterByProductionYear,
		FilterByStudio,
		FilterByTag,
	], (t) => t.type);
	
	static get Instance(): ItemFilterTypeStore {
		return this._instance ?? (this._instance = new ItemFilterTypeStore());
	}

	private static _instance: ItemFilterTypeStore;
}
