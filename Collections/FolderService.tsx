import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const FolderService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
