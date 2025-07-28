import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { EpisodeIcon } from "Shows/EpisodeIcon";

export const EpisodeService: BaseItemKindService = {
	findIcon: (props) => <EpisodeIcon {...props} />,
	findUrl: (item) => `/Show/${item.SeriesId}/Episode/${item.Id}`,
	personCreditName: (episode) => `${episode.SeriesName} - ${episode.Name}`,
	searchResultName: (episode) => `${episode.SeriesName} - ${episode.Name}`,
};
