import { BaseItemDto, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { MenuAction } from "Common/MenuAction";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { ImageShape } from "Items/ItemImage";

export interface BaseItemKindService {
	primaryShape?: ImageShape;
	findIcon?: (iconProps: IconProps, collectionType?: CollectionType) => JSX.Element;
	findUrl?: (item: BaseItemDto) => string;
	filterOptions?: ItemFilterType[];
	sortOptions?: ItemSortOption[];
	listActions?: MenuAction[][];
	personCreditName?: (item: BaseItemDto) => string;
	searchResultName?: (item: BaseItemDto) => string;
}
