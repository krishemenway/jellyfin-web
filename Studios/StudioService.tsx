import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { StudioIcon } from "Studios/StudioIcon";

export const StudioService: BaseItemKindService = {
	kind: "Studio",
	findIcon: (props) => <StudioIcon {...props} />,
};
