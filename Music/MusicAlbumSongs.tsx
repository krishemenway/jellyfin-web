import * as React from "react";
import { Layout } from "Common/Layout";
import { DateTime, Linq } from "Common/MissingJavascriptFunctions";
import { Button } from "Common/Button";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { MusicPlayerService } from "Music/MusicPlayerService";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { SortByIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";
import { DragIcon } from "CommonIcons/DragIcon";
import { useBackgroundStyles } from "AppStyles";

export const MusicAlbumSongs: React.FC<{ addFromChildOfId: string; allSongs: BaseItemDto[] }> = ({ addFromChildOfId, allSongs }) => {
	const tracksByDiscNumber = React.useMemo(() => Linq.GroupBy(allSongs.sort(SortByIndexNumber.sortFunc), (t) => t.ParentIndexNumber ?? 0), [allSongs]);
	const discs = Object.keys(tracksByDiscNumber).map((n) => parseInt(n));

	if (discs.length > 1) {
		return (
			<ListOf
				items={discs}
				direction="column" gap="1em"
				forEachItem={(discNumber) => (
					<Layout key={discNumber} direction="column" gap=".5em">
						<Layout direction="row" justifyContent="space-between" alignItems="center">
							<TranslatedText textKey="ValueDiscNumber" textProps={[discNumber.toString()]} />
							<Button type="button" icon={<PlayIcon />} onClick={() => MusicPlayerService.Instance.ClearAndPlay(tracksByDiscNumber[discNumber])} title={{ Key: "HeaderPlayAll" }} px=".25em" py=".25em" />
						</Layout>

						<AlbumSongs addFromChildOfId={addFromChildOfId} discSongs={tracksByDiscNumber[discNumber]} />
					</Layout>
				)}
			/>
		);
	}

	return <AlbumSongs addFromChildOfId={addFromChildOfId} discSongs={tracksByDiscNumber[discs[0]]} />;
};

const AlbumSongs: React.FC<{ addFromChildOfId: string; discSongs: BaseItemDto[] }>  = (props) => {
	const background = useBackgroundStyles();

	return (
		<ListOf
			items={props.discSongs}
			direction="column" className={background.alternatePanel}
			forEachItem={(song) => <AlbumSong key={song.Id} song={song} addFromChildOfId={props.addFromChildOfId} />}
		/>
	)
};

const AlbumSong: React.FC<{ song: BaseItemDto; addFromChildOfId: string; }> = (props) => {
	const featuringArtists = React.useMemo(() => props.song.Artists?.filter((a) => props.song.AlbumArtist?.toLowerCase() !== a.toLowerCase()) ?? [], [props.song]);

	return (
		<Layout key={props.song.Id} width="100%" direction="row" draggable onDragStart={(evt) => { evt.dataTransfer.setData("AddType", "AudioId"); evt.dataTransfer.setData("AddFromChildrenOfId", props.addFromChildOfId); evt.dataTransfer.setData("AddTypeId", props.song.Id ?? ""); }}>
			<Layout direction="column" alignItems="center" justifyContent="center" px=".5em" py=".5em"><DragIcon /></Layout>

			<Button
				transparent type="button" onClick={() => MusicPlayerService.Instance.ClearAndPlay([props.song])}
				direction="row" grow px=".25em" py=".25em" gap="4em">
				<Layout direction="row" grow textAlign="left" gap="1em">
					{props.song.IndexNumber}.&nbsp;{props.song.Name}
					{featuringArtists.length > 0 && <Layout direction="row" fontSize=".8em" alignItems="center">{featuringArtists.join(", ")}</Layout>}
				</Layout>
				<Layout direction="row">{DateTime.ConvertTicksToDurationString(props.song.RunTimeTicks)}</Layout>
			</Button>
		</Layout>
	);
};
