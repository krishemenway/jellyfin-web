import { ItemGroupByType } from "ItemList/ItemGroupByType";

export const GroupByGenre: ItemGroupByType = {
	GroupByType: "Genre",
	TypeLabel: { Key: "Genres" },
	FindKey: (item) => item.Genres ?? ["N/A"],
};
