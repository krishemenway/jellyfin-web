import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { VideoPlayerService } from "Videos/VideoPlayerService";

export const PlayVideoAction: ItemMenuAction = {
	icon: (p) => <PlayIcon {...p} />,
	textKey: "Play",
	action: (items) => {
		VideoPlayerService.Instance.ClearAndPlay(items);
	},
};
