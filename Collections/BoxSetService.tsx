import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { CollectionIcon } from "Collections/CollectionIcon";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { CollectionTypeService } from "Collections/CollectionTypeService";

export const BoxSetService: BaseItemKindService = {
	kind: "BoxSet",
	findIcon: (props) => <CollectionIcon {...props} />,
	findUrl: (item) => `/Collection/${item.Id}`,
	sortOptions: [
		SortByName,
		SortByDateCreated,
	],
};

export const BoxSetCollectionService: CollectionTypeService = {
	type: "boxsets",
	listUrl: (libraryId) => `/Collections/${libraryId}`,
	findIcon: (props) => <CollectionIcon {...props} />,
};
