import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";

export const PlaylistsFolderService: BaseItemKindService = {
	kind: "PlaylistsFolder",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
