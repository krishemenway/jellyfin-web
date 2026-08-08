import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemGroupByType } from "ItemList/ItemGroupByType";

export const GroupByPremiereDecade: ItemGroupByType = {
	GroupByType: "PremiereDecade",
	TypeLabel: { Key: "PremiereDecade" },
	FindKey: (item) => Nullable.Value(item.PremiereDate, "N/A", d => `${d.slice(0, 3)}0 - ${d.slice(0, 3)}9`),
};
