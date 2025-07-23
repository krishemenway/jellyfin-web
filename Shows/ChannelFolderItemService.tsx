import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

// this likely needs moving!
export const ChannelFolderItemService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
