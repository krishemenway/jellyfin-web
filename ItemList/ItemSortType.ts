import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { SortFuncs } from "Common/Sort";

export interface ItemSortType {
	field: string;
	labelKey: string;
	getContent: (item: BaseItemDto) => string|undefined|null;
	sortFunc: (a: BaseItemDto, b: BaseItemDto) => number;
}

export function CreateSortFunc(sortOption: ItemSortType, reversed: boolean, hidden: boolean): SortFuncs<BaseItemDto> {
	return {
		LabelKey: sortOption.labelKey,
		Sort: sortOption.sortFunc,
		GetContent: sortOption.getContent,
		Reversed: reversed,
		SortType: sortOption.field,
		Hidden: hidden,
	};
}
