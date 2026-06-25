import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export interface ItemSortType {
	field: string;
	labelKey: string;
	getContent: (item: BaseItemDto) => string|undefined|null;
	sortFunc: (a: BaseItemDto, b: BaseItemDto) => number;
}
