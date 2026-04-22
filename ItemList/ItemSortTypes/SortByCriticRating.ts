import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByCriticRating: ItemSortOption = {
	labelKey: 'OptionCriticRating',
	field: "CriticRating",
	getContent: (i) => i.CriticRating?.toString(),
	sortFunc: SortByNumber((i) => i.CriticRating),
};
