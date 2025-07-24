import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { YearIcon } from "Items/YearIcon";

export const YearService: BaseItemKindService = {
	findIcon: (props) => <YearIcon {...props} />,
};
