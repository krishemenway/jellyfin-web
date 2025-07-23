import { BaseItemDto, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";

export interface ItemSortOption {
	field: ItemSortBy;
	labelKey: string;
	sortFunc: (a: BaseItemDto, b: BaseItemDto) => number;
}
