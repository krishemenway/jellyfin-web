import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const LiveTVChannelService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
