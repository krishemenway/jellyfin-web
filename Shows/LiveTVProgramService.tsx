import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const LiveTVProgramService: BaseItemKindService = {
	kind: "LiveTvProgram",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
