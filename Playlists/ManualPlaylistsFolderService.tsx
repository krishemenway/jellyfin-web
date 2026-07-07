import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";

export const ManualPlaylistsFolderService: BaseItemKindService = {
	kind: "ManualPlaylistsFolder",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
