import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { TrailerIcon } from "Movies/TrailerIcon";

export const TrailerService: BaseItemKindService = {
	findIcon: (props) => <TrailerIcon {...props} />,
};
