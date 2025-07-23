import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

// TODO this likely needs moving!
export const ChannelService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
