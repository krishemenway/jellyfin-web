import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";

// TODO this likely needs moving!
export const ChannelService: BaseItemKindService = {
	kind: "Channel",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
