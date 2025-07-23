import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { CollectionIcon } from "Collections/CollectionIcon";

export const AggregateFolderService: BaseItemKindService = {
	findIcon: (props) => <CollectionIcon {...props} />,
};
