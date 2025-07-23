import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";


export const SortByOfficialRating: ItemSortOption = {
	labelKey: 'OptionParentalRating',
	field: "OfficialRating",
	sortFunc: SortByString((i) => i.OfficialRating),
};
