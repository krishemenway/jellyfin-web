import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { EpisodeIcon } from "Shows/EpisodeIcon";

export const EpisodeService: BaseItemKindService = {
	kind: "Episode",
	findIcon: (props) => <EpisodeIcon {...props} />,
	findUrl: (item) => `/Show/${item.SeriesId}/Episode/${item.Id}`,
	nameWithContext: (episode) => `${episode.SeriesName} - ${episode.Name}`,
};
