import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MusicPlayer } from "Music/MusicPlayer";
import { VideoPlayer } from "Videos/VideoPlayer";

export const MediaPlayer: React.FC = () => {
	const playerType = useObservable(MediaPlayerService.Instance.PlayerType);

	if (playerType === MediaPlayerType.Music) {
		return <MusicPlayer />;
	}

	if (playerType === MediaPlayerType.Video) {
		return <VideoPlayer />;
	}

	return <></>;
};
