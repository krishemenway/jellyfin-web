import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const LiveTVChannelService: BaseItemKindService = {
	kind: "LiveTvChannel",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
	listUrl: (libraryId) => `/LiveTV/${libraryId}`,
};
