import * as React from "react";
import { TableProps, TableVirtuoso, Virtuoso } from "react-virtuoso";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { Loading } from "Common/Loading";
import { ItemService } from "Items/ItemsService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { DateTime, Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { LoginService } from "Users/LoginService";
import { ApplyLayoutStyleProps, Layout, LayoutWithoutChildrenProps } from "Common/Layout";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NotFound } from "Common/NotFound";
import { useBackgroundStyles } from "AppStyles";
import { PlayIcon } from "PlayerIcons/PlayIcon";
import { TranslatedText } from "Common/TranslatedText";
import { StopIcon } from "PlayerIcons/StopIcon";
import { ForwardIcon } from "PlayerIcons/ForwardIcon";
import { Button } from "Common/Button";
import { BackwardIcon } from "PlayerIcons/BackwardIcon";
import { RepeatIcon } from "PlayerIcons/RepeatIcon";
import { ShuffleIcon } from "PlayerIcons/ShuffleIcon";
import { PauseIcon } from "PlayerIcons/PauseIcon";
import { PlaylistIcon } from "Playlists/PlaylistIcon";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { MusicPlayer } from "./MusicPlayer";
import { useObservable } from "@residualeffect/rereactor";
import { PageTitle } from "Common/PageTitle";
import { UserViewStore } from "Users/UserViewStore";
import { Slider } from "Common/Slider";
import { DragIcon } from "CommonIcons/DragIcon";

export const Music: React.FC = () => {
	const libraryId = useParams().libraryId;

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon="Audio"><NotFound /></PageWithNavigation>;
	}

	const albumList = ItemService.Instance.FindOrCreateItemList(libraryId, "MusicAlbum");
	const artistList = ItemService.Instance.FindOrCreateItemList(libraryId, "MusicArtist");
	const songList = ItemService.Instance.FindOrCreateItemList(libraryId, "Audio");

	React.useEffect(() => artistList.LoadWithAbort(), [artistList]);
	React.useEffect(() => albumList.LoadWithAbort([{ Key: "AlbumCountByArtistId", GetKeysForItem: (i) => i.AlbumArtists?.map((a) => a.Id) ?? [] }]), [albumList]);
	React.useEffect(() => songList.LoadWithAbort([{ Key: "SongCountByArtistId", GetKeysForItem: (i) => i.AlbumArtists?.map((a) => a.Id) ?? [] }, { Key: "SongCountByAlbumId", GetKeysForItem: (i) => [i.AlbumId] }]), [songList]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings(libraryId), [libraryId]);

	return (
		<PageWithNavigation icon="Audio">
			<Loading
				receivers={[SettingsStore.Instance.Settings, LoginService.Instance.User, UserViewStore.Instance.UserViews]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenReceived={(settings, user, libraries) => <LoadedMusicLibrary libraryId={libraryId} settings={settings} user={user} libraries={libraries} />}
			/>
		</PageWithNavigation>
	);
};

interface Column extends LayoutWithoutChildrenProps {
	name: string;
	getValue: (item: BaseItemDto, stats: Record<string, number>[]) => JSX.Element|string|undefined|null;
}

const LoadedMusicLibrary: React.FC<{ libraryId: string; settings: Settings; user: UserDto; libraries: BaseItemDto[] }> = (props) => {
	const background = useBackgroundStyles();
	const albumList = ItemService.Instance.FindOrCreateItemList(props.libraryId, "MusicAlbum");
	const artistList = ItemService.Instance.FindOrCreateItemList(props.libraryId, "MusicArtist");
	const songList = ItemService.Instance.FindOrCreateItemList(props.libraryId, "Audio");
	const library = Linq.Single(props.libraries, (l) => l.Id === props.libraryId);

	return (
		<Layout direction="row" height="100%" py="1em" gap="1em">
			<PageTitle text={library.Name!} />
			<Layout direction="column" width="25%" gap="1em">
				<MusicPlayerStatus className={background.panel} />
				<CurrentPlaylist className={background.panel} user={props.user} />
			</Layout>

			<Layout direction="column" grow gap="1em">
				<Layout direction="row" gap="1em" height="25%">
					<Layout direction="column" className={background.panel} grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
						<Loading
							receivers={[artistList.List, albumList.List, songList.List]}
							whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
							whenLoading={<LoadingIcon size="4em" />}
							whenNotStarted={<LoadingIcon size="4em" />}
							whenReceived={(artists, albums, songs) => (
								<LoadedItems
									items={artists.List}
									stats={[albums.Stats["AlbumCountByArtistId"], songs.Stats["SongCountByArtistId"]]}
									columns={[
										{ name: "Artist", getValue: (i) => i.Name, width: "80%", textAlign: "start" },
										{ name: "Albums", getValue: (i, stats) => Nullable.ValueOrDefault(stats[0][i.Id ?? ""], "0", (n) => n.toLocaleString()), width: "10%", textAlign: "center" },
										{ name: "Songs", getValue: (artist, stats) => Nullable.ValueOrDefault(stats[1][artist.Id ?? ""], "0", (n) => n.toLocaleString()), width: "10%", textAlign: "center" },
									]}
								/>
							)}
						/>
					</Layout>
					<Layout direction="row" className={background.panel} grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
						<Loading
							receivers={[albumList.List, songList.List]}
							whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
							whenLoading={<LoadingIcon size="4em" />}
							whenNotStarted={<LoadingIcon size="4em" />}
							whenReceived={(albums, songs) => (
								<LoadedItems
									items={albums.List}
									stats={[songs.Stats["SongCountByAlbumId"]]}
									columns={[
										{ name: "Album", getValue: (i) => i.Name, width: "40%", textAlign: "start" },
										{ name: "Artist", getValue: (i) => i.AlbumArtist, width: "40%", textAlign: "start" },
										{ name: "LabelYear", getValue: (i) => i.ProductionYear?.toString(), width: "10%", textAlign: "center" },
										{ name: "Songs", getValue: (album, stats) => Nullable.ValueOrDefault(stats[0][album.Id ?? ""], "0", (n) => n.toLocaleString()), width: "10%", textAlign: "center" },
									]}
								/>
							)}
						/>
					</Layout>
				</Layout>

				<Layout direction="row" className={background.panel} grow py="1em" px="1em" alignItems="center" justifyContent="center">
					<Loading
						receivers={[songList.List]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon size="4em" />}
						whenNotStarted={<LoadingIcon size="4em" />}
						whenReceived={(songs) => (
							<LoadedItems
								items={songs.List}
								columns={[
									{ name: "Title", getValue: (i) => <Button type="button" textAlign="start" className={background.transparent} onClick={() => { MusicPlayer.Instance.Add(i); }}>{i.Name}</Button>, width: "30%", textAlign: "start" },
									{ name: "Album", getValue: (i) => i.Album, width: "30%", textAlign: "start" },
									{ name: "Artist", getValue: (i) => i.AlbumArtist, width: "25%", textAlign: "start" },
									{ name: "LabelDuration", getValue: (i) => DateTime.ConvertTicksToDurationString(i.RunTimeTicks), width: "5%", textAlign: "center" },
									{ name: "Track", getValue: (i) => i.IndexNumber?.toString(), width: "5%", textAlign: "center" },
									{ name: "LabelYear", getValue: (i) => i.ProductionYear?.toString(), width: "5%", textAlign: "center" },
								]}
							/>
						)}
					/>
				</Layout>
			</Layout>
		</Layout>
	);
};

const MusicPlayerStatus: React.FC<{ className: string }> = (props) => {
	const current = useObservable(MusicPlayer.Instance.Current);
	const currentProgress = useObservable(MusicPlayer.Instance.CurrentProgress);

	return (
		<Layout direction="column" className={props.className} py="1em" px="1em" gap="1em">
			<Layout direction="row" fontSize="1.5em" gap=".5em" height="1.3em">
				{Nullable.ValueOrDefault(current, <StopIcon size="1em" />, () => <PlayIcon size="1em" />)}

				<Layout direction="row" overflowX="hidden" width="100%" textOverflow="ellipsis" whiteSpace="nowrap" display="block" grow>
					{Nullable.ValueOrDefault(current, <TranslatedText textKey="PriorityIdle" />, (c) => <>{c.PlaylistItem.Item.Name}</>)}
				</Layout>
			</Layout>

			<Layout direction="row" gap="1em">
				<Slider min={0} max={(current?.PlaylistItem.Item.RunTimeTicks ?? 0) / DateTime.TicksPerSecond} current={currentProgress} grow onChange={(newValue) => { MusicPlayer.Instance.ChangeProgress(newValue); }} />
				<Layout direction="row"><Duration ticks={currentProgress * DateTime.TicksPerSecond} /> / <Duration ticks={current?.PlaylistItem.Item.RunTimeTicks} /></Layout>
			</Layout>

			<Layout direction="row" fontSize="1.5em" justifyContent="space-between">
				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.GoBack(); }}><BackwardIcon size="1em" /></Button>
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.Play(); }}><PlayIcon size="1em" /></Button>
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.Pause(); }}><PauseIcon size="1em" /></Button>
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.Stop(); }}><StopIcon size="1em" /></Button>
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.GoNext(); }}><ForwardIcon size="1em" /></Button>
				</Layout>

				<Layout direction="row" gap=".25em">
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.ToggleRepeat(); }}><RepeatIcon size="1em" /></Button>
					<Button type="button" px=".25em" py=".25em" onClick={() => { MusicPlayer.Instance.ToggleShuffle(); }}><ShuffleIcon size="1em" /></Button>
				</Layout>
			</Layout>
		</Layout>
	);
};

const Duration: React.FC<{ ticks: number|undefined|null }> = (props) => {
	const totalProgress = React.useMemo(() => !Nullable.HasValue(props.ticks) ? "00:00" : DateTime.ConvertTicksToDurationString(props.ticks), [props.ticks])
	return <>{totalProgress}</>;
};

const CurrentPlaylist: React.FC<{ user: UserDto, className: string }> = (props) => {
	const background = useBackgroundStyles();
	const itemsInPlaylist = useObservable(MusicPlayer.Instance.Playlist);
	const current = useObservable(MusicPlayer.Instance.Current);

	return (
		<Layout direction="column" className={props.className} grow py="1em" px="1em" gap="1em">
			<Layout direction="row" fontSize="1.5em" justifyContent="space-between">
				<Layout direction="row" gap=".5em">
					<PlaylistIcon size="1em" />
					<TranslatedText textKey="LabelPlaylist" elementType="div" />
				</Layout>

				<Layout direction="row">
					<ItemActionsMenu
						user={props.user}
						actions={[[
							{
								textKey: "Save", icon: (p) => <SaveIcon {...p} />,
								action: () => { console.error("Missing Implementation"); },
							},
							{
								textKey: "ClearQueue", icon: (p) => <DeleteIcon {...p} />,
								action: () => { MusicPlayer.Instance.Playlist.clear(); },
							},
						]]}
					/>
				</Layout>
			</Layout>

			<Layout direction="column" grow>
				<Virtuoso
					data={itemsInPlaylist}
					totalCount={itemsInPlaylist.length}
					style={{ height: "100%", width: "100%" }}
					itemContent={(index, data) => (
						<Layout direction="row" position="relative">
							<Layout direction="column" alignItems="center" justifyContent="center" position="absolute" top={0} bottom={0} left={0} width="5%">
								{Nullable.ValueOrDefault(current, <DragIcon size="1em" />, (c) => c.PlaylistItem === data ? <PlayIcon size="1em" /> : <DragIcon size="1em" />)}
							</Layout>

							<Button width="100%" px="5%" type="button" textAlign="start" className={background.transparent} onClick={() => { MusicPlayer.Instance.GoIndex(index)}}>
								<Layout direction="column" px=".5em" py=".5em" width="80%">{data.Item.Name}</Layout>
								<Layout direction="column" px=".5em" py=".5em" alignItems="end" width="20%">{DateTime.ConvertTicksToDurationString(data.Item.RunTimeTicks)}</Layout>
							</Button>

							<Button
								className={background.transparent}
								type="button" onClick={() => { MusicPlayer.Instance.Remove(data); }}
								direction="column" alignItems="center" justifyContent="center"
								position="absolute" top={0} bottom={0} right={0} width="5%">
								<DeleteIcon size="1em" />
							</Button>
						</Layout>
					)}
				/>
			</Layout>
		</Layout>
	);
};

const LoadedItems: React.FC<{ items: BaseItemDto[]; columns: Column[]; stats?: Record<string, number>[] }> = (props) => {
	const background = useBackgroundStyles();
	return (
		<TableVirtuoso
			data={props.items}
			totalCount={props.items.length}
			style={{ height: "100%", width: "100%" }}
			components={{ Table: ({ style, ...props }: TableProps) => <table {...props} style={{ ...style, width: "100%" }} /> }}
			itemContent={(_, data) => <>{props.columns.map((c) => <td key={c.name} style={ApplyLayoutStyleProps({...c, ...{ display: "table-cell", py: ".25em" }})}>{c.getValue(data, props.stats ?? [])}</td>)}</>}
			fixedHeaderContent={() => (<tr>{props.columns.map((c) => <th key={c.name} className={background.alternatePanel} style={ApplyLayoutStyleProps({...c, ...{ display: "table-cell", py: ".5em" }})}><TranslatedText textKey={c.name} /></th>)}</tr>)}
		/>
	);
};
