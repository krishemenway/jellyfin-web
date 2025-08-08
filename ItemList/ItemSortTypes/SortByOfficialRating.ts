import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByOfficialRating: ItemSortOption = {
	labelKey: 'OptionParentalRating',
	field: "OfficialRating",
	sortFunc: SortByNumber((i) => RatingSortOrder[i.OfficialRating ?? ""] ?? 999),
};

const RatingSortOrder: Record<string, number|undefined> = {
	"G": 0,
	"TV-G": 0,
	"TV-Y": 25,
	"TV-Y7": 40,
	"PG": 50,
	"TV-PG": 50,
	"PG-13": 60,
	"TV-14": 60,
	"14": 60,
	"15": 70,
	"R": 75,
	"TV-MA": 75,
	"M": 75,
	"NC-17": 100,
	"Not Rated": 200,
	"NR": 200,
};