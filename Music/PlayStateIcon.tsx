import * as React from "react";
import { PlayState } from "Music/MusicPlayer";
import { PlayIcon } from "PlayerIcons/PlayIcon";
import { PauseIcon } from "PlayerIcons/PauseIcon";
import { StopIcon } from "PlayerIcons/StopIcon";

export const PlayStateIcon: React.FC<{ state: PlayState }> = (props) => {
	switch (props.state) {
		case PlayState.Playing:
			return <PlayIcon />
		case PlayState.Paused:
			return <PauseIcon />
		case PlayState.Stopped:
			return <StopIcon />;
	}
};
