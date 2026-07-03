import * as React from "react";
import { DimensionZLayers, Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { CloseIcon } from "CommonIcons/CloseIcon";
import { VideoPlayerService } from "Videos/VideoPlayerService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { MediaSourceInfo, PlaybackInfoResponse } from "@jellyfin/sdk/lib/generated-client/models";
import { ServerService } from "Servers/ServerService";
import { Slider } from "Common/Slider";
import { Duration } from "MediaPlayer/Duration";
import { useObservable } from "@residualeffect/rereactor";
import { BackwardIcon } from "MediaPlayer/BackwardIcon";
import { MediaPlayStateIcon } from "MediaPlayer/MediaPlayStateIcon";
import { ForwardIcon } from "MediaPlayer/ForwardIcon";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { RepeatIcon } from "MediaPlayer/RepeatIcon";
import { ShuffleIcon } from "MediaPlayer/ShuffleIcon";
import { ArrowDownIcon } from "CommonIcons/ArrowDownIcon";
import { ArrowUpIcon } from "CommonIcons/ArrowUpIcon";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { CurrentPlaylist } from "MediaPlayer/MediaPlayerPlaylistTable";

export const VideoPlayer: React.FC = () => {
	const fullscreen = useObservable(VideoPlayerService.Instance.Playlist.Fullscreen);
	const controlsVisible = useObservable(VideoPlayerService.Instance.ControlsVisible);

	return (
		<>
			<Layout direction="row" gap=".75em" position="fixed" zIndex={DimensionZLayers.Player} px=".25em" py=".25em" bottom="0" left="0" right="0" top={fullscreen ? 0 : undefined} backgroundColor="Panel" bt br bb bl>
				<Loading
					receivers={[VideoPlayerService.Instance.PlaybackInfo]}
					whenError={() => <></>}
					whenLoading={<LoadingIcon alignSelf="center" size="4em" />} whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
					whenReceived={(r) => <VideoElement playbackInfo={r} fullscreen={fullscreen} controlsVisible={controlsVisible} />}
				/>

				{!fullscreen && (
					<Layout direction="column" backgroundColor="AlternatePanel" grow>
						<VideoMetadata />
					</Layout>
				)}

				<CurrentPlaylist backgroundColor="AlternatePanel" bt br bb bl playlist={VideoPlayerService.Instance.Playlist} />

				<Layout direction={fullscreen ? "row" : "column"} position={fullscreen ? "absolute" : undefined} top="1rem" right="1rem" gap="1rem" opacity={controlsVisible ? 100 : 0}>
					<Button
						icon={fullscreen ? <ArrowDownIcon /> : <ArrowUpIcon />}
						type="button" onClick={() => { VideoPlayerService.Instance.Playlist.Fullscreen.Value = !VideoPlayerService.Instance.Playlist.Fullscreen.Value; }}
						px=".5em" py=".5em" height="100%" alignItems="center"
					/>

					<Button
						icon={<CloseIcon />}
						type="button" onClick={() => { VideoPlayerService.Instance.Unload(); }}
						px=".5em" py=".5em" height="100%" alignItems="center"
					/>
				</Layout>
			</Layout>

			<Layout direction="row" height="10em" />
		</>
	);
};

const VideoElement: React.FC<{ playbackInfo: PlaybackInfoResponse; fullscreen: boolean; controlsVisible: boolean; }> = ({ playbackInfo, fullscreen, controlsVisible }) => {
	const mediaSource = (playbackInfo.MediaSources ?? []).first();
	const url = getUrlFromMediaSource(mediaSource);

	return (
		<Layout direction="column" position="relative" width={!fullscreen ? "20rem" : "100%"} height={!fullscreen ? "12rem" : "100%"} backgroundColor="AlternatePanel" bt br bb bl py="1rem">
			<video
				src={url} ref={(element) => { VideoPlayerService.Instance.SetVideoElement(element); }}
				style={{ width: "100%", height: "100%", objectFit: "contain" }}
				disablePictureInPicture autoPlay
				onClick={() => { VideoPlayerService.Instance.MakeControlsVisible(); }}
				onFocus={() => { VideoPlayerService.Instance.MakeControlsVisible(); }}
				onMouseOver={() => { VideoPlayerService.Instance.MakeControlsVisible(); }}
			/>

			<VideoExtras fullscreen={fullscreen} controlsVisible={controlsVisible} />
		</Layout>
	);
};

const VideoExtras: React.FC<{ fullscreen: boolean; controlsVisible: boolean; }> = ({ fullscreen, controlsVisible }) => {
	const current = useObservable(VideoPlayerService.Instance.Playlist.Current);
	const currentProgress = useObservable(VideoPlayerService.Instance.Playlist.CurrentProgress);

	return (
		<>
			{!fullscreen && (
				<Layout direction="column" gap="1rem" position="absolute" bottom=".5rem" left="1rem" right="1rem">
					<Layout direction="row" gap="1em">
						<Slider min={0} max={(current?.Item.RunTimeTicks ?? 0) / DateTime.TicksPerSecond} current={currentProgress} grow onChange={(newValue) => { VideoPlayerService.Instance.ChangeProgress(newValue); }} />
					</Layout>
				</Layout>
			)}

			{fullscreen && (
				<Layout direction="column" gap="1rem" position="absolute" bottom=".5rem" left="1rem" right="1rem" opacity={controlsVisible ? 100 : 0}>
					<Layout direction="row" gap="1em">
						<Slider min={0} max={(current?.Item.RunTimeTicks ?? 0) / DateTime.TicksPerSecond} current={currentProgress} grow onChange={(newValue) => { VideoPlayerService.Instance.ChangeProgress(newValue); }} />
						<Layout direction="row"><Duration ticks={currentProgress * DateTime.TicksPerSecond} /> / <Duration ticks={current?.Item.RunTimeTicks} /></Layout>
					</Layout>

					<VideoControls />
				</Layout>
			)}
		</>
	)
}

const VideoControls: React.FC = () => {
	const playState = useObservable(VideoPlayerService.Instance.Playlist.State);
	const hasPrevious = useObservable(VideoPlayerService.Instance.Playlist.HasPrevious);
	const hasNext = useObservable(VideoPlayerService.Instance.Playlist.HasNext);
	const isRepeating = useObservable(VideoPlayerService.Instance.Playlist.Repeat);
	const isShuffling = useObservable(VideoPlayerService.Instance.Playlist.Shuffle);

	return (
		<Layout direction="row" fontSizeREM={1.5} justifyContent="space-between">
			<Layout direction="row" gap=".25em">
				<Button type="button" px=".25em" py=".25em" onClick={() => { VideoPlayerService.Instance.Playlist.GoBack(); }} icon={<BackwardIcon />} disabled={!hasPrevious}/>
				<Button
					px=".25em" py=".25em"
					icon={<MediaPlayStateIcon state={playState === MediaPlayState.Playing ? MediaPlayState.Paused : MediaPlayState.Playing} />}
					type="button" onClick={() => { if (playState !== MediaPlayState.Playing) { VideoPlayerService.Instance.Play(); } else { VideoPlayerService.Instance.Pause(); }}}
				/>
				<Button type="button" px=".25em" py=".25em" onClick={() => { VideoPlayerService.Instance.Stop(); }} icon={<MediaPlayStateIcon state={MediaPlayState.Stopped} />} disabled={playState === MediaPlayState.Stopped} />
				<Button type="button" px=".25em" py=".25em" onClick={() => { VideoPlayerService.Instance.Playlist.GoNext(); }} icon={<ForwardIcon />} disabled={!hasNext} />
			</Layout>

			<Layout direction="row" gap=".25em">
				<Button type="button" px=".25em" py=".25em" selected={isRepeating} onClick={() => { VideoPlayerService.Instance.Playlist.ToggleRepeat(); }} icon={<RepeatIcon />} />
				<Button type="button" px=".25em" py=".25em" selected={isShuffling} onClick={() => { VideoPlayerService.Instance.Playlist.ToggleShuffle(); }} icon={<ShuffleIcon />} />
			</Layout>
		</Layout>
	);
};

const VideoMetadata: React.FC = () => {
	const current = useObservable(VideoPlayerService.Instance.Playlist.Current);
	const currentProgress = useObservable(VideoPlayerService.Instance.Playlist.CurrentProgress);

	if (!Nullable.HasValue(current)) {
		return <></>;
	}

	const service = BaseItemKindServiceFactory.FindOrThrow(current.Item.Type);
	const headline = service.playerHeadline ?? ((item) => item.Name);
	const secondary = service.playerSecondaryHeadline ?? (() => "");

	return (
		<Layout direction="column" px=".5rem" py=".5rem" justifyContent="space-between" height="100%">
			<Layout direction="column" gap=".5rem">
				<Layout direction="row">{headline(current.Item)}</Layout>
				{Nullable.StringValue(secondary(current.Item), undefined, (secondary) => <Layout direction="row" fontColor="Secondary">{secondary}</Layout>)}
				<Layout direction="row" fontColor="Secondary"><Duration ticks={currentProgress * DateTime.TicksPerSecond} /> / <Duration ticks={current?.Item.RunTimeTicks} /></Layout>
			</Layout>

			<VideoControls />
		</Layout>
	);
}

function getUrlFromMediaSource(mediaSource: MediaSourceInfo): string {
	const api = ServerService.Instance.CurrentApi;

	if (mediaSource.SupportsDirectPlay || mediaSource.SupportsDirectStream) {
		const queryParams = new URLSearchParams({
			UserId: ServerService.Instance.CurrentUserId.Value,
			PlaySessionId: VideoPlayerService.Instance.PlaySessionId,
			DeviceId: api.deviceInfo.id,
			api_key: api.accessToken,
			MediaSourceId: mediaSource.Id ?? "",
		});

		return `${api.basePath}/Videos/${mediaSource.Id}/stream.${mediaSource.Container}?${queryParams.toString()}`;
	}

	if (mediaSource.SupportsTranscoding && Nullable.HasValue(mediaSource.TranscodingUrl)) {
		return `${api.basePath}${mediaSource.TranscodingUrl}`;
	}

	return "";
}
