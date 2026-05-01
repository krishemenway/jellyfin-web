import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { VideoIcon } from "Videos/VideoIcon";

export const VideoService: BaseItemKindService = {
	kind: "Video",
	findIcon: (props) => <VideoIcon {...props} />,
};
