import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { SortByString } from "Common/Sort";
import { ItemSortOption } from "ItemList/ItemSortOption";

export const SortByName: ItemSortOption = {
	labelKey: "LabelName",
	field: "Name",
	sortFunc: SortByString<BaseItemDto>((i) => i.Name),
};
