import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicIcon } from "Music/MusicIcon";

export const AudioService: BaseItemKindService = {
	findIcon: (props) => <MusicIcon {...props} />,
};
