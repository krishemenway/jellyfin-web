import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemGroupByType } from "ItemList/ItemGroupByType";
import { GroupByGenre } from "ItemList/ItemGroupByTypes/GroupByGenre";
import { GroupByStudio } from "ItemList/ItemGroupByTypes/GroupByStudio";
import { GroupByPremiereYear } from "ItemList/ItemGroupByTypes/GroupByPremiereYear";
import { GroupByPremiereDecade } from "ItemList/ItemGroupByTypes/GroupByPremiereDecade";
import { GroupByAlbumArtist, GroupByArtist } from "ItemList/ItemGroupByTypes/GroupByArtist";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { ReverseSort, SortByNumber, SortByString, SortFunc } from "Common/ArrayPrototype";
import { RandomStore } from "Common/RandomStore";

export interface GroupedItems {
	Label: string;
	Items: BaseItemDto[];
	ItemsCount: number;
}

export class ItemGroupByTypeStore {
	public FindOrThrow(groupByType: string): ItemGroupByType {
		const found = this._groupByTypes[groupByType];

		if (!Nullable.HasValue(found)) {
			throw new Error(`Unknown group by type ${groupByType}`);
		}

		return found;
	}

	public CreateSortFunc(sortType: string): SortFunc<GroupedItems> {
		switch (sortType) {
			case "Name":
				return SortByString((i) => i.Label);
			case "NameReverse":
				return ReverseSort(SortByString((i) => i.Label));
			case "Random":
				return SortByNumber((i) => RandomStore.Instance.FindOrCreateRandomValue(i.Label));
			case "MostItems":
				return ReverseSort(SortByNumber((i) => i.ItemsCount));
			case "LeastItems":
				return SortByNumber((i) => i.ItemsCount);
			default:
				return SortByString((i) => i.Label);
		}
	}

	public All: ItemGroupByType[] = [
		GroupByGenre,
		GroupByStudio,
		GroupByPremiereYear,
		GroupByPremiereDecade,
		GroupByArtist,
		GroupByAlbumArtist,
	];

	public AllSortTypes: string[] = [
		"Random",
		"Name",
		"NameReverse",
		"MostItems",
		"LeastItems",
	];

	private _groupByTypes: Record<string, ItemGroupByType> = this.All.toRecord((t) => t.GroupByType);
	
	static get Instance(): ItemGroupByTypeStore {
		return this._instance ?? (this._instance = new ItemGroupByTypeStore());
	}

	private static _instance: ItemGroupByTypeStore;
}
