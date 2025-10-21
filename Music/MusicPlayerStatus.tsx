import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { MusicPlayerService } from "Music/MusicPlayerService";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { Slider } from "Common/Slider";
import { TranslatedText } from "Common/TranslatedText";
import { BackwardIcon } from "MediaPlayer/BackwardIcon";
import { RepeatIcon } from "MediaPlayer/RepeatIcon";
import { ShuffleIcon } from "MediaPlayer/ShuffleIcon";
import { ForwardIcon } from "MediaPlayer/ForwardIcon";
import { MediaPlayStateIcon } from "MediaPlayer/MediaPlayStateIcon";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";

export const MusicPlayerStatus: React.FC<{ className?: string; isFullscreen?: true; }> = (props) => {
	const current = useObservable(MusicPlayerService.Instance.Current);
	const currentProgress = useObservable(MusicPlayerService.Instance.CurrentProgress);
	const isRepeating = useObservable(MusicPlayerService.Instance.Repeat);
	const isShuffling = useObservable(MusicPlayerService.Instance.Shuffle);
	const playState = useObservable(MusicPlayerService.Instance.State);

	const hasPrevious = useObservable(MusicPlayerService.Instance.HasPrevious);
	const hasNext = useObservable(MusicPlayerService.Instance.HasNext);

	return (
		<Layout direction="column" className={props.className} py="1em" px="1em" gap="1em">
			<Layout direction="row" fontSize="1.5em" gap=".5em" height="1.3em">
				<MediaPlayStateIcon state={playState} />

				<Layout direction="row" overflowX="hidden" width="100%" textOverflow="ellipsis" whiteSpace="nowrap" display="block" grow>
					{Nullable.Value(current, <TranslatedText textKey="PriorityIdle" />, (c) => <>{c.PlaylistItem.Item.Name}</>)}
				</Layout>
			</Layout>

			<Layout direction="row" gap="1em">
				<Slider min={0} max={(current?.PlaylistItem.Item.RunTimeTicks ?? 0) / DateTime.TicksPerSecond} current={currentProgress} grow onChange={(newValue) => { MusicPlayerService.Instance.ChangeProgress(newValue); }} />
				<Layout direction="row"><Duration ticks={currentProgress * DateTime.TicksPerSecond} /> / <Duration ticks={current?.PlaylistItem.Item.RunTimeTicks} /></Layout>
			</Layout>

			<Layout direction="row" fontSize="1.5em" justifyContent="space-between">
				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.GoBack(); }} icon={<BackwardIcon />} disabled={!hasPrevious}/>
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Play(); }} icon={<MediaPlayStateIcon state={MediaPlayState.Playing} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Pause(); }} icon={<MediaPlayStateIcon state={MediaPlayState.Paused} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.Stop(); }} icon={<MediaPlayStateIcon state={MediaPlayState.Stopped} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayerService.Instance.GoNext(); }} icon={<ForwardIcon />} disabled={!hasNext} />
				</Layout>

				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" selected={isRepeating} onClick={() => { MusicPlayerService.Instance.ToggleRepeat(); }} icon={<RepeatIcon />} />
					<Button type="button" px=".25em" py=".25em" selected={isShuffling} onClick={() => { MusicPlayerService.Instance.ToggleShuffle(); }} icon={<ShuffleIcon />} />
				</Layout>
			</Layout>
		</Layout>
	);
};

const Duration: React.FC<{ ticks: number|undefined|null }> = (props) => {
	const totalProgress = React.useMemo(() => !Nullable.HasValue(props.ticks) ? "00:00" : DateTime.ConvertTicksToDurationString(props.ticks), [props.ticks])
	return <>{totalProgress}</>;
};
