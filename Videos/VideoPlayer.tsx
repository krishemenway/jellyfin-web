import * as React from "react";
import { DimensionZLayers, Layout, StyleLayoutProps } from "Common/Layout";
import { Button } from "Common/Button";
import { useObservable } from "@residualeffect/rereactor";
import { CloseIcon } from "CommonIcons/CloseIcon";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { FullscreenIcon } from "MediaPlayer/FullscreenIcon";
import { VideoPlayerService } from "Videos/VideoPlayerService";

function getLayoutProps(isFullscreen: boolean): Partial<StyleLayoutProps> {
	if (isFullscreen) {
		return ({
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		});
	} else {
		return ({
			bottom: "1em",
			right: "1em",
			minWidth: "25em",
			maxWidth: "30em",
		});
	}
}

export const VideoPlayer: React.FC = () => {
	const closePlayer = () => { VideoPlayerService.Instance.Unload(); MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.None; };
	const toggleFullscreen = () => { MediaPlayerService.Instance.IsFullscreen.Value = !MediaPlayerService.Instance.IsFullscreen.Value; };
	const isFullscreen = useObservable(MediaPlayerService.Instance.IsFullscreen);
	const currentVideoPlayerSource = useObservable(VideoPlayerService.Instance.CurrentSource);

	return (
		<Layout direction="column" position="fixed" zIndex={DimensionZLayers.Player} {...getLayoutProps(isFullscreen)}>
			<Layout direction="row" justifyContent="end">
				<Button type="button" icon={<FullscreenIcon />} onClick={toggleFullscreen} px=".5em" py=".5em" />
				<Button type="button" icon={<CloseIcon />} onClick={closePlayer} px=".5em" py=".5em" />
			</Layout>

			<video src={currentVideoPlayerSource} controls autoPlay />
		</Layout>
	);
};
