import { SortByNumber } from "Common/ArrayPrototype";
import { RandomStore } from "Common/RandomStore";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByRandom: ItemSortType = {
	labelKey: "OptionRandom",
	field: "Random",
	getContent: (i) => RandomStore.Instance.FindOrCreateRandomValue(i.Id).toLocaleString(),
	sortFunc: SortByNumber((i) => RandomStore.Instance.FindOrCreateRandomValue(i.Id)),
};

