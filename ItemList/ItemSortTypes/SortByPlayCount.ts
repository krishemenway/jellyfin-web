import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByPlayCount: ItemSortOption = {
	labelKey: 'OptionPlayCount',
	field: "PlayCount",
	getContent: (i) => i.UserData?.PlayCount?.toString(),
	sortFunc: SortByNumber((i) => i.UserData?.PlayCount),
};
