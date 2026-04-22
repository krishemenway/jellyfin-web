import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByCommunityRating: ItemSortOption = {
	labelKey: 'OptionCommunityRating',
	field: "CommunityRating",
	getContent: (i) => i.CommunityRating?.toString(),
	sortFunc: SortByNumber((i) => i.CommunityRating),
};
