import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";

export const MusicGenreService: BaseItemKindService = {
	kind: "MusicGenre",
	findIcon: (props) => <QuestionMarkIcon {...props} />,
};
