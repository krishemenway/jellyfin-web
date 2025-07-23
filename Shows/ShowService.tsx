import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { TVIcon } from "Shows/TVIcon";

export const ShowService: BaseItemKindService = {
	findIcon: (props) => <TVIcon {...props} />,
	findUrl: (item) => `/Show/${item.Id}`,
};
