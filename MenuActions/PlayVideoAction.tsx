import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { VideoPlayerService } from "Videos/VideoPlayerService";

const videoTypes = [
	"Video",
	"Episode",
	"Movie",
];

export const PlayVideoAction: ItemMenuAction = {
	icon: (p) => <PlayIcon {...p} />,
	textKey: "Play",
	visible: (_, items) => items.some((i) => videoTypes.indexOf(i.Type ?? "") > -1),
	action: (items) => {
		VideoPlayerService.Instance.ClearAndPlay(items);
	},
};
