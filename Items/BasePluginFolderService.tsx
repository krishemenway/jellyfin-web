import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { FolderIcon } from "Common/FolderIcon";

export const BasePluginFolderService: BaseItemKindService = {
	findIcon: (props) => <FolderIcon {...props} />,
};
