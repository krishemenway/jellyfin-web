import { SortByNumber } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByRandom: ItemSortType = {
	labelKey: 'OptionRandom',
	field: "Random",
	getContent: (i) => FindOrCreateRandomValue(i.Id).toLocaleString(),
	sortFunc: SortByNumber((i) => FindOrCreateRandomValue(i.Id)),
};

const RandomValuesById: Record<string, number|undefined> = {};
function FindOrCreateRandomValue(id: string|undefined): number {
	if (id === undefined) {
		return 0;
	}

	return RandomValuesById[id] ?? (RandomValuesById[id] = Math.random());
}
