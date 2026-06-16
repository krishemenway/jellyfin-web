import { BaseItemDto, BaseItemKind, CollectionType, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortType } from "ItemList/ItemSortType";
import { ImageShape } from "Items/ItemImage";

export interface BaseItemKindService {
	kind: BaseItemKind;

	primaryShape?: ImageShape;
	findIcon?: (iconProps: IconProps, collectionType?: CollectionType) => React.ReactNode;
	findUrl?: (item: BaseItemDto) => string;
	listUrl?: (libraryId: string) => string;

	relevantPersonKinds?: PersonKind[];

	filterOptions?: ItemFilterType[];
	sortOptions?: ItemSortType[];
	loadList?: (a: AbortController, libraryId: string) => Promise<BaseItemDto[]>;
	listTypes?: BaseItemKind[];

	playerHeadline?: (item: BaseItemDto) => string;
	playerSecondaryHeadline?: (item: BaseItemDto) => string;
	nameWithContext?: (item: BaseItemDto) => string;
}
