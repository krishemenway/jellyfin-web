import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const PlaylistsFolderService: BaseItemKindService = {
	kind: "PlaylistsFolder",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
