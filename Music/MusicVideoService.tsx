import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const MusicVideoService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
