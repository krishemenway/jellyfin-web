import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";

// this likely needs moving!
export const ChannelFolderItemService: BaseItemKindService = {
	kind: "ChannelFolderItem",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
