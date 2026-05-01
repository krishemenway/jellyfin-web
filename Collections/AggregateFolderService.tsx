import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { CollectionIcon } from "Collections/CollectionIcon";

export const AggregateFolderService: BaseItemKindService = {
	kind: "AggregateFolder",
	findIcon: (props) => <CollectionIcon {...props} />,
};
