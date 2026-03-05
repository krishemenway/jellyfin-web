import * as React from "react";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MusicPlayer } from "Music/MusicPlayer";
import { VideoPlayer } from "Videos/VideoPlayer";

export const MediaPlayer: React.FC<{ user: UserDto; }> = (props) => {
	const playerType = useObservable(MediaPlayerService.Instance.PlayerType);

	if (playerType === MediaPlayerType.Music) {
		return <MusicPlayer user={props.user} />;
	}

	if (playerType === MediaPlayerType.Video) {
		return <VideoPlayer />;
	}

	return <></>;
};
