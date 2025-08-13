import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { MusicPlayer, PlayState } from "Music/MusicPlayer";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { Slider } from "Common/Slider";
import { TranslatedText } from "Common/TranslatedText";
import { BackwardIcon } from "PlayerIcons/BackwardIcon";
import { RepeatIcon } from "PlayerIcons/RepeatIcon";
import { ShuffleIcon } from "PlayerIcons/ShuffleIcon";
import { ForwardIcon } from "PlayerIcons/ForwardIcon";
import { PlayStateIcon } from "Music/PlayStateIcon";
import { CloseIcon } from "CommonIcons/CloseIcon";

export const MusicPlayerStatus: React.FC<{ className?: string; forPortable?: true; }> = (props) => {
	const current = useObservable(MusicPlayer.Instance.Current);
	const currentProgress = useObservable(MusicPlayer.Instance.CurrentProgress);
	const isRepeating = useObservable(MusicPlayer.Instance.Repeat);
	const isShuffling = useObservable(MusicPlayer.Instance.Shuffle);
	const playState = useObservable(MusicPlayer.Instance.State);

	return (
		<Layout direction="column" className={props.className} py="1em" px="1em" gap="1em">
			<Layout direction="row" fontSize="1.5em" gap=".5em" height="1.3em">
				<PlayStateIcon state={playState} />

				<Layout direction="row" overflowX="hidden" width="100%" textOverflow="ellipsis" whiteSpace="nowrap" display="block" grow>
					{Nullable.ValueOrDefault(current, <TranslatedText textKey="PriorityIdle" />, (c) => <>{c.PlaylistItem.Item.Name}</>)}
				</Layout>

				{props.forPortable && (
					<Button type="button" alignSelf="center" onClick={() => { MusicPlayer.Instance.Stop(); MusicPlayer.Instance.PortablePlayerOpen.Value = false; }} icon={<CloseIcon />} />
				)}
			</Layout>

			<Layout direction="row" gap="1em">
				<Slider min={0} max={(current?.PlaylistItem.Item.RunTimeTicks ?? 0) / DateTime.TicksPerSecond} current={currentProgress} grow onChange={(newValue) => { MusicPlayer.Instance.ChangeProgress(newValue); }} />
				<Layout direction="row"><Duration ticks={currentProgress * DateTime.TicksPerSecond} /> / <Duration ticks={current?.PlaylistItem.Item.RunTimeTicks} /></Layout>
			</Layout>

			<Layout direction="row" fontSize="1.5em" justifyContent="space-between">
				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.GoBack(); }} icon={<BackwardIcon />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.Play(); }} icon={<PlayStateIcon state={PlayState.Playing} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.Pause(); }} icon={<PlayStateIcon state={PlayState.Paused} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.Stop(); }} icon={<PlayStateIcon state={PlayState.Stopped} />} />
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.GoNext(); }} icon={<ForwardIcon />} />
				</Layout>

				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" selected={isRepeating} onClick={() => { MusicPlayer.Instance.ToggleRepeat(); }} icon={<RepeatIcon />} />
					<Button type="button" px=".25em" py=".25em" selected={isShuffling} onClick={() => { MusicPlayer.Instance.ToggleShuffle(); }} icon={<ShuffleIcon />} />
				</Layout>
			</Layout>
		</Layout>
	);
};

const Duration: React.FC<{ ticks: number|undefined|null }> = (props) => {
	const totalProgress = React.useMemo(() => !Nullable.HasValue(props.ticks) ? "00:00" : DateTime.ConvertTicksToDurationString(props.ticks), [props.ticks])
	return <>{totalProgress}</>;
};
