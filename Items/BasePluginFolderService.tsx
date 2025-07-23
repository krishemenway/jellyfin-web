import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const BasePluginFolderService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
