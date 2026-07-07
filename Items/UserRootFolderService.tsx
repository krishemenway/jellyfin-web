import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";

export const UserRootFolderService: BaseItemKindService = {
	kind: "UserRootFolder",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
