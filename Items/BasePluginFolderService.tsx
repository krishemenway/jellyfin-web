import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { FolderIcon } from "Collections/FolderIcon";

export const BasePluginFolderService: BaseItemKindService = {
	kind: "BasePluginFolder",
	findIcon: (props) => <FolderIcon {...props} />,
};
