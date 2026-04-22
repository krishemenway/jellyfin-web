import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByNumber } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByOfficialRating: ItemSortOption = {
	labelKey: 'OptionParentalRating',
	field: "OfficialRating",
	getContent: (i) => i.OfficialRating,
	sortFunc: SortByNumber((i) => GetOrder(i.OfficialRating)),
};

export function GetOrder(value: string|undefined|null): number {
	if (!Nullable.HasValue(value)) {
		return MaxRatingOrder;
	}

	return RatingSortOrder[value] ?? MaxRatingOrder;
}

export const MaxRatingOrder = 999;
export const RatingSortOrder: Record<string, number|undefined> = {
	"G": 0,
	"TV-G": 0,
	"TP": 0,
	"TV-Y": 25,
	"TV-Y7": 40,
	"TV-Y7-FV": 40,
	"PG": 50,
	"TV-PG": 50,
	"TV-PG-D": 50,
	"TV-PG-L": 50,
	"TV-PG-S": 50,
	"TV-PG-V": 50,
	"TV-PG-DL": 50,
	"TV-PG-DS": 50,
	"TV-PG-DV": 50,
	"TV-PG-LS": 50,
	"TV-PG-LV": 50,
	"TV-PG-SV": 50,
	"TV-PG-DLS": 50,
	"TV-PG-DLV": 50,
	"TV-PG-DSV": 50,
	"TV-PG-LSV": 50,
	"TV-PG-DLSV": 50,
	"PG-13": 60,
	"13+": 60,
	"TV-14": 60,
	"TV-14-D": 60,
	"TV-14-L": 60,
	"TV-14-S": 60,
	"TV-14-V": 60,
	"TV-14-DL": 60,
	"TV-14-DS": 60,
	"TV-14-DV": 60,
	"TV-14-LS": 60,
	"TV-14-LV": 60,
	"TV-14-SV": 60,
	"TV-14-DLS": 60,
	"TV-14-DLV": 60,
	"TV-14-DSV": 60,
	"TV-14-LSV": 60,
	"TV-14-DLSV": 60,
	"14": 60,
	"15": 70,
	"MA15+": 73,
	"16+": 73,
	"18+": 75,
	"R": 75,
	"TV-MA": 75,
	"TV-MA-L": 75,
	"TV-MA-S": 75,
	"TV-MA-V": 75,
	"TV-MA-LS": 75,
	"TV-MA-LV": 75,
	"TV-MA-SV": 75,
	"TV-MA-LSV": 75,
	"M": 75,
	"NC-17": 100,
	"Not Rated": 200,
	"Unrated": 200,
	"NR": 200,
	"TV-X": 200,
	"TV-AO": 200,
	"21": 200,
	"XXX": 200,
	"Banned": 300,
};
