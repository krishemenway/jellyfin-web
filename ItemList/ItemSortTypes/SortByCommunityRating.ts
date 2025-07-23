import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByCommunityRating: ItemSortOption = {
	labelKey: 'OptionCommunityRating',
	field: "CommunityRating",
	sortFunc: SortByNumber((i) => i.CommunityRating),
};
