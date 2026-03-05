import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { Nullable } from "Common/MissingJavascriptFunctions";

export const CollectionFolderService: BaseItemKindService = {
	sortOptions: [ ],
	findIcon: (props, collectionType) => {
		const itemKindService = BaseItemKindServiceFactory.FindOrNullByCollectionType(collectionType);

		if (!Nullable.HasValue(itemKindService?.findIcon)) {
			return <QuestionMarkIcon {...props} />;
		}

		return itemKindService.findIcon(props);
	},
	findUrl: (item) => {
		const itemKindService = BaseItemKindServiceFactory.FindOrNullByCollectionType(item.CollectionType);

		if (!Nullable.HasValue(itemKindService?.listUrl)) {
			throw new Error("Missing url for item " + item.Name)
		}

		return itemKindService.listUrl(item);
	}
};
