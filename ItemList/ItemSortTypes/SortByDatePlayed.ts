import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByDatePlayed: ItemSortOption = {
	labelKey: 'OptionDatePlayed',
	field: "DatePlayed",
	sortFunc: SortByString((i) => i.UserData?.LastPlayedDate),
};
