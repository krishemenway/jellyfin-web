import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { SeasonIcon } from "Shows/SeasonIcon";

export const SeasonService: BaseItemKindService = {
	kind: "Season",
	findIcon: (props) => <SeasonIcon {...props} />,
	findUrl: (item) => `/Show/${item.SeriesId}/Season/${item.Id}`,
	nameWithContext: (item) => `${item.SeriesName} - ${item.Name}`,
};
