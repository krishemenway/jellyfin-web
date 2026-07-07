import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";

export const LiveTVProgramService: BaseItemKindService = {
	kind: "LiveTvProgram",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
