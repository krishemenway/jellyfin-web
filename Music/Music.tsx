import * as React from "react";
import { TableProps, TableVirtuoso } from "react-virtuoso";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { Loading } from "Common/Loading";
import { ItemService } from "Items/ItemsService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { DateTime, Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { LoginService } from "Users/LoginService";
import { Layout } from "Common/Layout";
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

export const Music: React.FC = () => {
	const libraryId = useParams().libraryId;

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon="Audio"><NotFound /></PageWithNavigation>;
	}

	const albumList = ItemService.Instance.FindOrCreateItemList(libraryId, "MusicAlbum");
	const artistList = ItemService.Instance.FindOrCreateItemList(libraryId, "MusicArtist");
	const songList = ItemService.Instance.FindOrCreateItemList(libraryId, "Audio");

	React.useEffect(() => albumList.LoadWithAbort(), [albumList]);
	React.useEffect(() => artistList.LoadWithAbort(), [artistList]);
	React.useEffect(() => songList.LoadWithAbort(), [songList]);
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

interface Column {
	Name: string;
	GetValue: (item: BaseItemDto) => JSX.Element|string|undefined|null;
	Width?: string;
	Align?: "center"|"start"|"end";
}

const artistColumns: Column[] = [
	{ Name: "Artist", GetValue: (i) => i.Name, Width: "80%" },
	{ Name: "Albums", GetValue: () => "0", Width: "10%", Align: "center" },
	{ Name: "Songs", GetValue: () => "0", Width: "10%", Align: "center" },
];

const albumColumns: Column[] = [
	{ Name: "Album", GetValue: (i) => i.Name, Width: "40%" },
	{ Name: "Artist", GetValue: (i) => i.AlbumArtist, Width: "40%" },
	{ Name: "LabelYear", GetValue: (i) => i.ProductionYear?.toString(), Width: "10%", Align: "center" },
	{ Name: "Songs", GetValue: () => "0", Width: "10%", Align: "center" },
];

function useSongColumns(): Column[] {
	const background = useBackgroundStyles();
	const columns: Column[] = [
		{ Name: "Title", GetValue: (i) => <Button type="button" className={background.transparent} onClick={() => { MusicPlayer.Instance.Playlist.push(i); }}>{i.Name}</Button>, Width: "30%" },
		{ Name: "Album", GetValue: (i) => i.Album, Width: "30%" },
		{ Name: "Artist", GetValue: (i) => i.AlbumArtist, Width: "25%" },
		{ Name: "LabelDuration", GetValue: (i) => DateTime.ConvertTicksToDurationString(i.RunTimeTicks), Width: "5%", Align: "center" },
		{ Name: "Track", GetValue: (i) => i.IndexNumber?.toString(), Width: "5%", Align: "center" },
		{ Name: "LabelYear", GetValue: (i) => i.ProductionYear?.toString(), Width: "5%", Align: "center" },
	];

	return columns;
}

const LoadedMusicLibrary: React.FC<{ libraryId: string; settings: Settings; user: UserDto; libraries: BaseItemDto[] }> = (props) => {
	const background = useBackgroundStyles();
	const [songColumns] = [useSongColumns()];
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
							receivers={[artistList.List]}
							whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
							whenLoading={<LoadingIcon size="4em" />}
							whenNotStarted={<LoadingIcon size="4em" />}
							whenReceived={(artists) => <LoadedItems items={artists} columns={artistColumns} />}
						/>
					</Layout>
					<Layout direction="row" className={background.panel} grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
						<Loading
							receivers={[albumList.List]}
							whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
							whenLoading={<LoadingIcon size="4em" />}
							whenNotStarted={<LoadingIcon size="4em" />}
							whenReceived={(albums) => <LoadedItems items={albums} columns={albumColumns} />}
						/>
					</Layout>
				</Layout>

				<Layout direction="row" className={background.panel} grow py="1em" px="1em" alignItems="center" justifyContent="center">
					<Loading
						receivers={[songList.List]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon size="4em" />}
						whenNotStarted={<LoadingIcon size="4em" />}
						whenReceived={(songs) => <LoadedItems items={songs} columns={songColumns} />}
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
			<Layout direction="row" fontSize="1.5em" gap=".5em">
				{current === undefined && <><StopIcon size="1em" /><TranslatedText textKey="PriorityIdle" elementType="div" /></>}
				{current !== undefined && <><PlayIcon size="1em" />{current.Item.Name}</>}
			</Layout>

			<Layout direction="row" gap="1em">
				<Slider min={0} max={1000} current={currentProgress} grow onChange={(newValue) => { MusicPlayer.Instance.CurrentProgress.Value = newValue; }} />
				<Layout direction="row">00:00 / 00:00</Layout>
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

const CurrentPlaylist: React.FC<{ user: UserDto, className: string }> = (props) => {
	const itemsInPlaylist = useObservable(MusicPlayer.Instance.Playlist);

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
				<TableVirtuoso
					data={itemsInPlaylist}
					totalCount={itemsInPlaylist.length}
					style={{ height: "100%", width: "100%" }}
					components={{ Table: ({ style, ...props }: TableProps) => <table {...props} style={{ ...style, width: "100%" }} /> }}
					itemContent={(_, data) => (
						<>
							<td style={{ padding: ".5em", width: "80%" }}>{data.Name}</td>
							<td style={{ padding: ".5em", width: "20%", textAlign: "right" }}>{DateTime.ConvertTicksToDurationString(data.RunTimeTicks)}</td>
						</>
					)}
				/>
			</Layout>
		</Layout>
	);
};

const LoadedItems: React.FC<{ items: BaseItemDto[], columns: Column[] }> = (props) => {
	return (
		<TableVirtuoso
			data={props.items}
			totalCount={props.items.length}
			style={{ height: "100%", width: "100%" }}
			components={{ Table: ({ style, ...props }: TableProps) => <table {...props} style={{ ...style, width: "100%" }} /> }}
			itemContent={(_, data) => <>{props.columns.map((c) => <td key={c.Name} style={{ width: c.Width, textAlign: c.Align, padding: ".25em 0" }}>{c.GetValue(data)}</td>)}</>}
			fixedHeaderContent={() => (
				<tr>
					{props.columns.map((c) => <th key={c.Name} style={{ width: c.Width, textAlign: c.Align, padding: ".5em 0" }}><TranslatedText textKey={c.Name} /></th>)}
				</tr>
			)}
		/>
	);
};
