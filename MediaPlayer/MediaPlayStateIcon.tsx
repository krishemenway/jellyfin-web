import * as React from "react";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { PauseIcon } from "MediaPlayer/PauseIcon";
import { StopIcon } from "MediaPlayer/StopIcon";

export const MediaPlayStateIcon: React.FC<{ state: MediaPlayState }> = (props) => {
	switch (props.state) {
		case MediaPlayState.Playing:
			return <PlayIcon />
		case MediaPlayState.Paused:
			return <PauseIcon />
		case MediaPlayState.Stopped:
			return <StopIcon />;
	}
};
