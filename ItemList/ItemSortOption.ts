import { BaseItemDto, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { SortFuncs } from "Common/Sort";

export interface ItemSortOption {
	field: ItemSortBy;
	labelKey: string;
	getContent: (item: BaseItemDto) => string|undefined|null;
	sortFunc: (a: BaseItemDto, b: BaseItemDto) => number;
}

export function CreateSortFunc(sortOption: ItemSortOption, reversed: boolean): SortFuncs<BaseItemDto> {
	return {
		LabelKey: sortOption.labelKey,
		Sort: sortOption.sortFunc,
		GetContent: sortOption.getContent,
		Reversed: reversed,
		SortType: sortOption.field
	};
}
