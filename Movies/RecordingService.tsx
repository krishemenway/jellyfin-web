import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { RecordingIcon } from "Movies/RecordingIcon";

export const RecordingService: BaseItemKindService = {
	findIcon: (props) => <RecordingIcon {...props} />,
};
