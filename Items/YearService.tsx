import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { YearIcon } from "Items/YearIcon";

export const YearService: BaseItemKindService = {
	kind: "Year",
	findIcon: (props) => <YearIcon {...props} />,
};
