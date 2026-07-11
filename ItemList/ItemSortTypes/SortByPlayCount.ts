import { SortByNumber } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByPlayCount: ItemSortType = {
	labelKey: "OptionPlayCount",
	field: "PlayCount",
	getContent: (i) => i.UserData?.PlayCount?.toString(),
	sortFunc: SortByNumber((i) => i.UserData?.PlayCount),
};
