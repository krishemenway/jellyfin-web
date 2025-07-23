import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const EpisodeService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
	findUrl: (item) => `/Show/${item.SeriesId}/Episode/${item.Id}`,
	personCreditName: (episode) => `${episode.SeriesName} - ${episode.Name}`,
	searchResultName: (episode) => `${episode.SeriesName} - ${episode.Name}`,
};
