import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { CollectionServiceFactory } from "Collections/CollectionTypeService";

export const CollectionFolderService: BaseItemKindService = {
	kind: "CollectionFolder",
	sortOptions: [ ],
	findIcon: (props, collectionType) => Nullable.Value(CollectionServiceFactory.FindOrNullByCollectionType(collectionType)?.findIcon, <QuestionMarkIcon {...props} />, findIcon => findIcon(props, collectionType) as React.ReactElement),
	findUrl: (item) => CollectionServiceFactory.FindOrThrowByCollectionType(item.CollectionType).listUrl(item.Id!),
};
