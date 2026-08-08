import { ItemGroupByType } from "ItemList/ItemGroupByType";

export const GroupByStudio: ItemGroupByType = {
	GroupByType: "Studio",
	TypeLabel: { Key: "Studios" },
	FindKey: (item) => item.Studios?.map(s => s.Name ?? "") ?? ["N/A"],
};
