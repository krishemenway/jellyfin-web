import * as React from "react";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MusicPlayer } from "Music/MusicPlayer";
import { VideoPlayer } from "Videos/VideoPlayer";

export const MediaPlayer: React.FC<{ user: UserDto; libraries: BaseItemDto[]; }> = ({ user, libraries }) => {
	const playerType = useObservable(MediaPlayerService.Instance.PlayerType);

	if (playerType === MediaPlayerType.Music) {
		return <MusicPlayer user={user} libraries={libraries} />;
	}

	if (playerType === MediaPlayerType.Video) {
		return <VideoPlayer />;
	}

	return <></>;
};
