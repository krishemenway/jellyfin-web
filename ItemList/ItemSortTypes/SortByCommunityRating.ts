import { SortByNumber } from "Common/Sort";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByCommunityRating: ItemSortType = {
	labelKey: 'OptionCommunityRating',
	field: "CommunityRating",
	getContent: (i) => i.CommunityRating?.toString(),
	sortFunc: SortByNumber((i) => i.CommunityRating),
};
