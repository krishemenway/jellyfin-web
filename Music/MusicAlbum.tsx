import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { NotFound } from "Common/NotFound";
import { DateTime, Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { PageTitle } from "Common/PageTitle";
import { Button } from "Common/Button";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { MusicPlayerService } from "Music/MusicPlayerService";
import { ListOf } from "Common/ListOf";
import { ItemOverview } from "Items/ItemOverview";
import { TranslatedText } from "Common/TranslatedText";
import { ItemTags } from "Items/ItemTags";
import { useBackgroundStyles } from "AppStyles";
import { ItemImage } from "Items/ItemImage";
import { ItemRating } from "Items/ItemRating";
import { ItemStudios } from "Items/ItemStudios";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { SortByIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";
import { DragIcon } from "CommonIcons/DragIcon";

export const MusicAlbum: React.FC = () => {
	const background = useBackgroundStyles();
	const routeParams = useParams<{ albumId: string; songId?: string; }>();
	const albumId = routeParams.albumId;

	if (!Nullable.HasValue(albumId)) {
		return <PageWithNavigation icon="MusicAlbum"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(albumId).LoadItemWithAbort(), [albumId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(albumId).LoadChildrenWithAbort(), [albumId]);

	return (
		<PageWithNavigation icon="MusicAlbum">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(albumId).Item, ItemService.Instance.FindOrCreateItemData(albumId).Children]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(album, allSongs) => (
					<Layout direction="column" py="1em">
						<Layout direction="row" gap="1em" py="1em">
							<Layout direction="column" maxWidth="33.333%" gap=".5em">
								<Layout direction="column" position="relative">
									<ItemImage item={album} type="Primary" />
									<ItemRating item={album} position="absolute" bottom=".5em" right=".5em" />
								</Layout>

								<ItemStudios
									item={album}
									direction="row" gap=".5em"
									linkClassName={background.button}
									linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
									showMoreLimit={3}
								/>

								<ItemExternalLinks
									item={album}
									direction="row" gap=".5em"
									linkClassName={background.button}
									linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
								/>

								<ItemGenres
									item={album}
									direction="row" gap=".5em"
									linkClassName={background.button}
									linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
									showMoreLimit={4}
								/>
							</Layout>

							<Layout direction="column" maxWidth="100em" grow gap="1em">
								<Layout direction="row" justifyContent="space-between" gap="2em">
									<PageTitle text={album.Name} />
									<Button type="button" icon={<PlayIcon />} onClick={() => MusicPlayerService.Instance.ClearAndPlay(allSongs)} title={{ Key: "HeaderPlayAll" }} px=".25em" py=".25em" />
								</Layout>

								<Layout direction="column" gap="1em" maxWidth="95%">
									<ItemOverview item={album} />

									{(album.Tags?.length ?? 0) > 0 && (
										<Layout direction="row" gap=".5em">
											<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: ".25em", py: ".25em" }} />
											<ItemTags
												item={album}
												direction="row" gap=".5em" wrap
												linkClassName={background.button}
												linkLayout={{ px: ".25em", py: ".25em" }}
												showMoreLimit={25}
											/>
										</Layout>
									)}

									<AlbumSongsWithPossibleDiscs albumId={albumId} allSongs={allSongs} />
								</Layout>
							</Layout>
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};

const AlbumSongsWithPossibleDiscs: React.FC<{ albumId: string; allSongs: BaseItemDto[] }> = ({ albumId, allSongs }) => {
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

						<AlbumSongs albumId={albumId} discSongs={tracksByDiscNumber[discNumber]} />
					</Layout>
				)}
			/>
		);
	}

	return <AlbumSongs albumId={albumId} discSongs={tracksByDiscNumber[discs[0]]} />;
};

const AlbumSongs: React.FC<{ albumId: string; discSongs: BaseItemDto[] }>  = ({ albumId, discSongs }) => {
	return (
		<ListOf
			items={discSongs}
			direction="column"
			forEachItem={(song) => (
				<Layout key={song.Id} width="100%" direction="row" draggable onDragStart={(evt) => { evt.dataTransfer.setData("AddType", "AudioId"); evt.dataTransfer.setData("AddFromChildrenOfId", albumId); evt.dataTransfer.setData("AddTypeId", song.Id ?? ""); }}>
					<Layout direction="column" alignItems="center" justifyContent="center" px=".5em" py=".5em"><DragIcon /></Layout>

					<Button
						transparent type="button" onClick={() => MusicPlayerService.Instance.ClearAndPlay([song])}
						direction="row" grow px=".25em" py=".25em" gap="4em">
						<Layout direction="row" grow>{song.IndexNumber}.&nbsp;{song.Name}</Layout>
						<Layout direction="row">{DateTime.ConvertTicksToDurationString(song.RunTimeTicks)}</Layout>
					</Button>
				</Layout>
			)}
		/>
	)
};

