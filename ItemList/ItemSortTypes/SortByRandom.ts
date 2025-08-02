import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByRandom: ItemSortOption = {
	labelKey: 'OptionRandom',
	field: "Random",
	sortFunc: SortByNumber((i) => FindOrCreateRandomValue(i.Id)),
};

const RandomValuesById: Record<string, number|undefined> = {};
function FindOrCreateRandomValue(id: string|undefined): number {
	if (id === undefined) {
		return 0;
	}

	return RandomValuesById[id] ?? (RandomValuesById[id] = Math.random());
}
