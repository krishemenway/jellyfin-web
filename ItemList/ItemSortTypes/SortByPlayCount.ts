import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByPlayCount: ItemSortOption = {
	labelKey: 'OptionPlayCount',
	field: "PlayCount",
	sortFunc: SortByNumber((i) => i.UserData?.PlayCount),
};
