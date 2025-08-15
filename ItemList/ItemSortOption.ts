import { BaseItemDto, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { SortFuncs } from "Common/Sort";

export interface ItemSortOption {
	field: ItemSortBy;
	labelKey: string;
	sortFunc: (a: BaseItemDto, b: BaseItemDto) => number;
}

export function CreateSortFunc(sortOption: ItemSortOption, reversed: boolean): SortFuncs<BaseItemDto> {
	return {
		LabelKey: sortOption.labelKey,
		Sort: sortOption.sortFunc,
		Reversed: reversed,
		SortType: sortOption.field
	};
}
