import * as React from "react";
import { DimensionZLayers, Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { CloseIcon } from "CommonIcons/CloseIcon";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { VideoPlayerService } from "Videos/VideoPlayerService";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { useBackgroundStyles } from "AppStyles";
import { MediaSourceInfo, PlaybackInfoResponse } from "@jellyfin/sdk/lib/generated-client/models";
import { ServerService } from "Servers/ServerService";

export const VideoPlayer: React.FC = () => {
	const background = useBackgroundStyles();

	return (
		<>
			<Layout direction="row" gap=".75em" position="fixed" zIndex={DimensionZLayers.Player} px=".25em" py=".25em" bottom="0" left="0" right="0" className={background.panel}>
				<Layout direction="column" className={background.alternatePanel}>
					<Loading
						receivers={[VideoPlayerService.Instance.PlaybackInfo]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
						whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
						whenReceived={(r) => <VideoElement playbackInfo={r} />}
					/>
				</Layout>

				<Layout direction="column" className={background.alternatePanel} grow>Data About the Video</Layout>

				<Layout direction="column" className={background.alternatePanel}>
					<Button
						icon={<CloseIcon />}
						type="button" onClick={() => { VideoPlayerService.Instance.Unload(); MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.None; }}
						px=".5em" py=".5em" height="100%" alignItems="center"
					/>
				</Layout>
			</Layout>

			<Layout direction="row" height="10em" />
		</>
	);
};

const VideoElement: React.FC<{ playbackInfo: PlaybackInfoResponse }> = ({ playbackInfo }) => {
	const mediaSource = Linq.First(playbackInfo.MediaSources ?? []);

	return (
		<video
			controls autoPlay
			ref={(element) => { VideoPlayerService.Instance.SetVideoElement(element)}}
			src={getUrlFromMediaSource(mediaSource)}
		/>
	);
}

function getUrlFromMediaSource(mediaSource: MediaSourceInfo): string {
	const api = ServerService.Instance.CurrentApi;

	if (mediaSource.SupportsDirectPlay || mediaSource.SupportsDirectStream) {
		const queryParams = new URLSearchParams({
			UserId: ServerService.Instance.CurrentUserId.Value,
			DeviceId: api.deviceInfo.id,
			api_key: api.accessToken,
			PlaySessionId: VideoPlayerService.Instance.PlaySessionId,
			MediaSourceId: mediaSource.Id ?? "",
			// Tag=
		});

		return `${api.basePath}/Videos/${mediaSource.Id}/stream.${mediaSource.Container}?${queryParams.toString()}`;
	}

	if (mediaSource.SupportsTranscoding && Nullable.HasValue(mediaSource.TranscodingUrl)) {
		return `${api.basePath}${mediaSource.TranscodingUrl}`;
	}

	return "";
}
