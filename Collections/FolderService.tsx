import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { FolderIcon } from "Collections/FolderIcon";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { CollectionTypeService } from "Collections/CollectionTypeService";

export const FolderService: BaseItemKindService = {
	kind: "Folder",
	findIcon: (props) => <FolderIcon {...props} />,
	sortOptions: [
		SortByDateCreated,
	],
};

export const FolderCollectionService: CollectionTypeService = {
	type: "folders",
	listUrl: (libraryId) => `/Folders/${libraryId}`,
	findIcon: (props) => <FolderIcon {...props} />,
};
