import * as React from "react";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MusicPlayer } from "Music/MusicPlayer";
import { VideoPlayer } from "Videos/VideoPlayer";
import { LoginService } from "Users/LoginService";
import { Loading } from "Common/Loading";

export const MediaPlayer: React.FC = () => (
	<Loading
		receivers={[LoginService.Instance.User]} whenNotStarted={<></>} whenLoading={<></>} whenError={() => <></>}
		whenReceived={(user) => <MediaPlayerTypeView user={user} />}
	/>
);

const MediaPlayerTypeView: React.FC<{ user: UserDto }> = ({ user }) => {
	const playerType = useObservable(MediaPlayerService.Instance.PlayerType);

	if (playerType === MediaPlayerType.Music) {
		return <MusicPlayer user={user} />;
	}

	if (playerType === MediaPlayerType.Video) {
		return <VideoPlayer />;
	}

	return <></>;
};
