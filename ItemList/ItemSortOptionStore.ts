import { Linq } from "Common/MissingJavascriptFunctions";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { SortByCommunityRating } from "ItemList/ItemSortTypes/SortByCommunityRating";
import { SortByCriticRating } from "ItemList/ItemSortTypes/SortByCriticRating";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByOfficialRating } from "ItemList/ItemSortTypes/SortByOfficialRating";
import { SortByPlayCount } from "ItemList/ItemSortTypes/SortByPlayCount";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByProductionYear } from "ItemList/ItemSortTypes/SortByProductionYear";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";

export class ItemSortOptionStore {
	constructor() {
		this.SortOptions = [
			SortByCommunityRating,
			SortByCriticRating,
			SortByDateCreated,
			SortByDatePlayed,
			SortByIndexNumber,
			SortByName,
			SortByOfficialRating,
			SortByPlayCount,
			SortByPremiereDate,
			SortByProductionYear,
			SortByRandom,
			SortByRuntime,
		];
	}

	public FindOrThrow(field: string): ItemSortOption {
		return Linq.Single(this.SortOptions, (o) => o.field === field);
	}

	public SortOptions: ItemSortOption[];
	
	static get Instance(): ItemSortOptionStore {
		return this._instance ?? (this._instance = new ItemSortOptionStore());
	}

	private static _instance: ItemSortOptionStore;
}
