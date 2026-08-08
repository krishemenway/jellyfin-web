import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemGroupByType } from "ItemList/ItemGroupByType";

export const GroupByPremiereYear: ItemGroupByType = {
	GroupByType: "PremiereYear",
	TypeLabel: { Key: "PremiereYear" },
	FindKey: (item) => Nullable.Value(item.PremiereDate, "N/A", d => d.slice(0, 4)),
};
