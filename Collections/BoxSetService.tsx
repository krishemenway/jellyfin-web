import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { CollectionIcon } from "Collections/CollectionIcon";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";

export const BoxSetService: BaseItemKindService = {
	findIcon: (props) => <CollectionIcon {...props} />,
	findUrl: (item) => `/Collection/${item.Id}`,
	sortOptions: [
		SortByName,
		SortByDateCreated,
	],
};
