import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { StudioIcon } from "Studios/StudioIcon";

export const StudioService: BaseItemKindService = {
	findIcon: (props) => <StudioIcon {...props} />,
};
