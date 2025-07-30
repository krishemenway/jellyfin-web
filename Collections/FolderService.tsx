import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { FolderIcon } from "Collections/FolderIcon";

export const FolderService: BaseItemKindService = {
	findIcon: (props) => <FolderIcon {...props} />,
};
