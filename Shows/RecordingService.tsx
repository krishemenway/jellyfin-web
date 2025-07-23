import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

// TODO this is likely in teh wrong place?
export const RecordingService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
