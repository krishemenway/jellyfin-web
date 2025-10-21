import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { VideoIcon } from "Videos/VideoIcon";

export const VideoService: BaseItemKindService = {
	findIcon: (props) => <VideoIcon {...props} />,
};
