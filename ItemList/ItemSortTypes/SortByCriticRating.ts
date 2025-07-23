import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByCriticRating: ItemSortOption = {
	labelKey: 'OptionCriticRating',
	field: "CriticRating",
	sortFunc: SortByNumber((i) => i.CriticRating),
};
