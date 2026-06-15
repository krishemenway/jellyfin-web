import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { ItemSortType } from "ItemList/ItemSortType";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByCriticRating } from "ItemList/ItemSortTypes/SortByCriticRating";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByIndexNumber, SortByParentIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByOfficialRating } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByPlayCount } from "ItemList/ItemSortTypes/SortByPlayCount";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByProductionYear } from "ItemList/ItemSortTypes/SortByProductionYear";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";
import { SortByTagCount } from "ItemList/ItemSortTypes/SortByTagCount";

export class ItemSortTypeStore {
	constructor() {
		this.All = Linq.ToRecord([
			SortByCommunityRating,
			SortByCriticRating,
			SortByDateCreated,
			SortByDatePlayed,
			SortByIndexNumber,
			SortByParentIndexNumber,
			SortByName,
			SortByOfficialRating,
			SortByPlayCount,
			SortByPremiereDate,
			SortByProductionYear,
			SortByRandom,
			SortByRuntime,
			SortByTagCount,
		], (sort) => sort.field);
	}

	public FindOrThrow(type: string): ItemSortType {
		const sort = this.All[type];

		if (!Nullable.HasValue(sort)) {
			throw new Error(`Unknown sort type ${type}`);
		}

		return sort;
	}

	public All: Record<string, ItemSortType>;
	
	static get Instance(): ItemSortTypeStore {
		return this._instance ?? (this._instance = new ItemSortTypeStore());
	}

	private static _instance: ItemSortTypeStore;
}
