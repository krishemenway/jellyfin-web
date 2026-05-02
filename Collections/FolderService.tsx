import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { FolderIcon } from "Collections/FolderIcon";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";

export const FolderService: BaseItemKindService = {
	kind: "Folder",
	findIcon: (props) => <FolderIcon {...props} />,
	listUrl: (library) => `/Folders/${library.Id}`,
	sortOptions: [
		SortByDateCreated,
	],
};
