import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Virtuoso } from "react-virtuoso";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { DimensionZLayers, Layout } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";
import { TranslatedText } from "Common/TranslatedText";
import { Button } from "Common/Button";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { MusicPlayerService } from "Music/MusicPlayerService";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { Slider } from "Common/Slider";
import { DragIcon } from "CommonIcons/DragIcon";
import { CloseIcon } from "CommonIcons/CloseIcon";
import { MediaPlayStateIcon } from "MediaPlayer/MediaPlayStateIcon";
import { BackwardIcon } from "MediaPlayer/BackwardIcon";
import { ForwardIcon } from "MediaPlayer/ForwardIcon";
import { ShuffleIcon } from "MediaPlayer/ShuffleIcon";
import { RepeatIcon } from "MediaPlayer/RepeatIcon";

export const MusicPlayer: React.FC<{ user: UserDto }> = ({ user }) => {
	const background = useBackgroundStyles();

	return (
		<>
			<Layout direction="row" gap=".75rem" position="fixed" zIndex={DimensionZLayers.Player} px=".25rem" py=".25rem" bottom="1rem" left="1rem" right="1rem" className={background.panel}>
				<MusicPlayerStatus className={background.alternatePanel} />
				<CurrentPlaylist className={background.alternatePanel} user={user} />

				<Layout direction="column" className={background.alternatePanel}>
					<Button
						icon={<CloseIcon />}
						type="button" onClick={() => { MusicPlayerService.Instance.Unload(); MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.None; }}
						px=".5rem" py=".5rem" height="100%" alignItems="center"
					/>
				</Layout>
			</Layout>
			<Layout direction="row" height="11rem" />
		</>
	);
};

export const MusicPlayerStatus: React.FC<{ className?: string; isFullscreen?: true; }> = (props) => {
	const current = useObservable(MusicPlayerService.Instance.Playlist.Current);
	const currentProgress = useObservable(MusicPlayerService.Instance.CurrentProgress);
	const isRepeating = useObservable(MusicPlayerService.Instance.Playlist.Repeat);
	const isShuffling = useObservable(MusicPlayerService.Instance.Playlist.Shuffle);
	const playState = useObservable(MusicPlayerService.Instance.State);

	const hasPrevious = useObservable(MusicPlayerService.Instance.Playlist.HasPrevious);
	const hasNext = useObservable(MusicPlayerService.Instance.Playlist.HasNext);

	return (
		<Layout direction="column" className={props.className} py=".5em" px=".5em" gap="1em" width="40%">
			<Layout direction="row" fontSize="1.2em" lineHeight="1.5em" gap=".5em" alignItems="center">
				<MediaPlayStateIcon state={playState} />

				<Layout direction="row" overflowX="hidden" width="100%" textOverflow="ellipsis" whiteSpace="nowrap" display="block" grow>
					{Nullable.Value(current, <TranslatedText textKey="PriorityIdle" />, (c) => <>{c.Item.Name}</>)}
				</Layout>
			</Layout>

			<Layout direction="row" gap="1em">
				<Slider min={0} max={(current?.Item.RunTimeTicks ?? 0) / DateTime.TicksPerSecond} current={currentProgress} grow onChange={(newValue) => { MusicPlayerService.Instance.ChangeProgress(newValue); }} />
				<Layout direction="row"><Duration ticks={currentProgress * DateTime.TicksPerSecond} /> / <Duration ticks={current?.Item.RunTimeTicks} /></Layout>
			</Layout>

			<Layout direction="row" fontSize="1.5em" justifyContent="space-between">
				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Playlist.GoBack(); }} icon={<BackwardIcon />} disabled={!hasPrevious}/>
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Play(); }} icon={<MediaPlayStateIcon state={MediaPlayState.Playing} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Pause(); }} icon={<MediaPlayStateIcon state={MediaPlayState.Paused} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Stop(); }} icon={<MediaPlayStateIcon state={MediaPlayState.Stopped} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Playlist.GoNext(); }} icon={<ForwardIcon />} disabled={!hasNext} />
				</Layout>

				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" selected={isRepeating} onClick={() => { MusicPlayerService.Instance.Playlist.ToggleRepeat(); }} icon={<RepeatIcon />} />
					<Button type="button" px=".25em" py=".25em" selected={isShuffling} onClick={() => { MusicPlayerService.Instance.Playlist.ToggleShuffle(); }} icon={<ShuffleIcon />} />
				</Layout>
			</Layout>
		</Layout>
	);
};

const Duration: React.FC<{ ticks: number|undefined|null }> = (props) => {
	const totalProgress = React.useMemo(() => !Nullable.HasValue(props.ticks) ? "00:00" : DateTime.ConvertTicksToDurationString(props.ticks), [props.ticks])
	return <>{totalProgress}</>;
};

const CurrentPlaylist: React.FC<{ className: string; user: UserDto }> = (props) => {
	const background = useBackgroundStyles();
	const itemsInPlaylist = useObservable(MusicPlayerService.Instance.Playlist.ItemsInOrder);
	const current = useObservable(MusicPlayerService.Instance.Playlist.Current);
	const playState = useObservable(MusicPlayerService.Instance.State);

	return (
		<Layout
			className={props.className}
			direction="column" grow py=".25em" px=".25em"
			onDragOver={(evt) => {
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "copy";

				Nullable.TryExecute((evt.target as HTMLElement).closest("*[data-index]") as HTMLElement|undefined|null, (element) => {
					const elementMidpoint = element.getBoundingClientRect().height / 2;
					
					if (evt.nativeEvent.offsetY > elementMidpoint) {
						element.style.borderTopStyle = "";
						element.style.borderBottomStyle = "solid";
					} else {
						element.style.borderTopStyle = "solid";
						element.style.borderBottomStyle = "";
					}
				});
			}}
			onDragLeave={(evt) => {
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "copy";

				Nullable.TryExecute((evt.target as HTMLElement).closest("*[data-index]") as HTMLElement|undefined|null, (element) => {
					element.style.borderStyle = "";
				});
			}}
			onDrop={(evt) => {
				evt.preventDefault();
				evt.dataTransfer.dropEffect ="copy";

				const addAfterIndex = Nullable.Value((evt.target as HTMLElement).closest("*[data-index]") as HTMLElement|undefined|null, undefined, (element) => {
					const index = parseInt(element.attributes.getNamedItem("data-index")?.value ?? "0", 10);
					const elementMidpoint = element.getBoundingClientRect().height / 2;
					element.style.borderStyle = "";

					return evt.nativeEvent.offsetY > elementMidpoint ? index : index - 1;
				});

				MusicPlayerService.Instance.HandleDrop(evt.dataTransfer, addAfterIndex);
			}}
		>
			{itemsInPlaylist.length > 0 ? (
				<Virtuoso
					data={itemsInPlaylist}
					computeItemKey={(_, item) => item.Id}
					style={{ height: "100%", width: "100%" }}
					itemContent={(index, data) => (
						<Layout direction="row" position="relative" draggable onDragStart={(evt) => { evt.dataTransfer.setData("AddType", "MovePlaylistItem"); evt.dataTransfer.setData("AddTypeId", index.toString()); }}>
							<Layout direction="column" alignItems="center" justifyContent="center" position="absolute" top={0} bottom={0} left={0} width="5%">
								{Nullable.Value(current, <DragIcon />, (c) => c === data ? <MediaPlayStateIcon state={playState} /> : <DragIcon />)}
							</Layout>

							<Button transparent width="100%" px="5%" type="button" textAlign="start" onClick={() => { MusicPlayerService.Instance.Playlist.GoIndex(index)}}>
								<Layout direction="column" px=".5em" py=".5em" width="80%">{data.Item.Name}</Layout>
								<Layout direction="column" px=".5em" py=".5em" justifyContent="center" alignItems="end" width="20%">{DateTime.ConvertTicksToDurationString(data.Item.RunTimeTicks)}</Layout>
							</Button>

							<Button
								type="button" onClick={() => { MusicPlayerService.Instance.Playlist.Remove(data); }}
								direction="column" alignItems="center" justifyContent="center" transparent
								position="absolute" top={0} bottom={0} right={0} width="5%"
								icon={<DeleteIcon />}
							/>
						</Layout>
					)}
				/>
			) : (
				<Layout className={background.dashed} direction="column" justifyContent="center" alignItems="center" width="100%" py="5em">
					<TranslatedText textKey="AddToPlaylist" />
				</Layout>
			)}
		</Layout>
	);
};
