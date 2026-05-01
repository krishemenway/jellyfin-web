import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const ManualPlaylistsFolderService: BaseItemKindService = {
	kind: "ManualPlaylistsFolder",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
