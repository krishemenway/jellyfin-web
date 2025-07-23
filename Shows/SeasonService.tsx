import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const SeasonService: BaseItemKindService = {
	findIcon: (props) => <QuestionMarkIcon {...props} />,
	findUrl: (item) => `/Show/${item.SeriesId}/Season/${item.Id}`,
};
