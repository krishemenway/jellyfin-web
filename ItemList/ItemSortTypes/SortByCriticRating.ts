import { SortByNumber } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByCriticRating: ItemSortType = {
	labelKey: 'OptionCriticRating',
	field: "CriticRating",
	getContent: (i) => i.CriticRating?.toString(),
	sortFunc: SortByNumber((i) => i.CriticRating),
};
