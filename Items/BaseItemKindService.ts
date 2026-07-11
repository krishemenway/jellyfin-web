import { BaseItemDto, BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortType } from "ItemList/ItemSortType";
import { ImageShape } from "Items/ItemImage";

export interface BaseItemKindService {
	kind: BaseItemKind;

	primaryShape?: ImageShape;
	findIcon?: (iconProps: IconProps, collectionType?: CollectionType) => React.ReactNode;
	findUrl?: (item: BaseItemDto) => string;

	filterOptions?: ItemFilterType[];
	sortOptions?: ItemSortType[];

	playerHeadline?: (item: BaseItemDto) => string;
	playerSecondaryHeadline?: (item: BaseItemDto) => string;
	nameWithContext?: (item: BaseItemDto) => string;
}
