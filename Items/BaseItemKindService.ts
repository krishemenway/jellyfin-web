import { BaseItemDto, BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { ImageShape } from "Items/ItemImage";

export interface BaseItemKindService {
	primaryShape?: ImageShape;
	findIcon?: (iconProps: IconProps, collectionType?: CollectionType) => JSX.Element;
	findUrl?: (item: BaseItemDto) => string;
	listUrl?: (libraryItem: BaseItemDto) => string;

	filterOptions?: ItemFilterType[];
	sortOptions?: ItemSortOption[];
	listActions?: ItemMenuAction[][];
	loadList?: (a: AbortController, libraryId: string) => Promise<BaseItemDto[]>;
	listTypes?: BaseItemKind[];

	personCreditName?: (item: BaseItemDto) => string;
	searchResultName?: (item: BaseItemDto) => string;
}
