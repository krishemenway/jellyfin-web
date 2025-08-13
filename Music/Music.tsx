import * as React from "react";
import { ItemProps, TableProps, TableVirtuoso, Virtuoso } from "react-virtuoso";
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
import { TranslatedText } from "Common/TranslatedText";
import { Button } from "Common/Button";
import { PlaylistIcon } from "Playlists/PlaylistIcon";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { AddPlaylistItemType, MusicPlayer } from "Music/MusicPlayer";
import { useObservable } from "@residualeffect/rereactor";
import { PageTitle } from "Common/PageTitle";
import { UserViewStore } from "Users/UserViewStore";
import { DragIcon } from "CommonIcons/DragIcon";
import { SortByNumber, SortByObjects, SortByString } from "Common/Sort";
import { ObservableArray } from "@residualeffect/reactor";
import { MusicPlayerStatus } from "Music/MusicPlayerStatus";
import { PlayStateIcon } from "Music/PlayStateIcon";

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
	React.useEffect(() => songList.LoadWithAbort([{ Key: "SongCountByArtistId", GetKeysForItem: (i) => i.Artists?.map((a) => a) ?? [] }, { Key: "SongCountByAlbumId", GetKeysForItem: (i) => [i.AlbumId] }]), [songList]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings(libraryId), [libraryId]);
	React.useEffect(() => MusicPlayer.Instance.CloseMiniPlayerAndReopenIfNecessary(), [libraryId]);

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
	name: string;
	getValue: (item: BaseItemDto, stats: Record<string, number>[]) => React.ReactNode;
	align?: "start"|"end"|"center";
	width?: string;
	getSortFunc: (stats: Record<string, number>[]) => (a: BaseItemDto, b: BaseItemDto) => number;
}

const LoadedMusicLibrary: React.FC<{ libraryId: string; settings: Settings; user: UserDto; libraries: BaseItemDto[] }> = (props) => {
	const background = useBackgroundStyles();
	const observableArtists = React.useMemo(() => new ObservableArray<string>([]), [props.libraryId]);
	const observableAlbumIds = React.useMemo(() => new ObservableArray<string>([]), [props.libraryId]);

	const albumList = ItemService.Instance.FindOrCreateItemList(props.libraryId, "MusicAlbum");
	const artistList = ItemService.Instance.FindOrCreateItemList(props.libraryId, "MusicArtist");
	const audioList = ItemService.Instance.FindOrCreateItemList(props.libraryId, "Audio");
	const library = Linq.Single(props.libraries, (l) => l.Id === props.libraryId);

	const filteredArtists = useObservable(observableArtists);
	const filteredAlbumIds = useObservable(observableAlbumIds);

	return (
		<Layout direction="row" height="100%" py="1em" gap="1em">
			<PageTitle text={library.Name!} />
			<Layout direction="column" width="25%" gap="1em">
				<MusicPlayerStatus className={background.panel} />
				<CurrentPlaylist className={background.panel} user={props.user} library={library} />
			</Layout>

			<Layout direction="column" grow gap="1em">
				<Layout direction="row" gap="1em" height="25%">
					<Layout direction="column" className={background.panel} grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
						<Loading
							receivers={[artistList.List, albumList.List, audioList.List]}
							whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
							whenLoading={<LoadingIcon size="4em" />}
							whenNotStarted={<LoadingIcon size="4em" />}
							whenReceived={(artists, albums, songs) => (
								<LoadedItems
									addType="ArtistName"
									items={artists.List}
									selectedKeys={filteredArtists}
									getSelectedKey={(i) => i.Name!}
									stats={[albums.Stats["AlbumCountByArtistId"], songs.Stats["SongCountByArtistId"]]}
									onToggled={(artist) => { Nullable.TryExecute(artist.Name, (name) => observableArtists.toggle(name)); }}
									columns={[
										{ name: "Artist", getValue: (i) => i.Name, width: "80%", align: "start", getSortFunc: () => SortByString((i) => i.Name) },
										{ name: "Albums", getValue: (artist, stats) => Nullable.ValueOrDefault(stats[0][artist.Id ?? ""], 0, (n) => n), width: "10%", align: "center", getSortFunc: (stats) => SortByNumber((artist) => Nullable.ValueOrDefault(stats[0][artist.Id ?? ""], 0, (n) => n)) },
										{ name: "Songs", getValue: (artist, stats) => Nullable.ValueOrDefault(stats[1][artist.Name ?? ""], 0, (n) => n), width: "10%", align: "center", getSortFunc: (stats) => SortByNumber((artist) => Nullable.ValueOrDefault(stats[1][artist.Name ?? ""], 0, (n) => n)) },
									]}
								/>
							)}
						/>
					</Layout>
					<Layout direction="row" className={background.panel} grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
						<Loading
							receivers={[albumList.List, audioList.List]}
							whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
							whenLoading={<LoadingIcon size="4em" />}
							whenNotStarted={<LoadingIcon size="4em" />}
							whenReceived={(albums, songs) => (
								<LoadedItems
									addType="AlbumId"
									items={albums.List}
									getSelectedKey={(i) => i.Id!}
									selectedKeys={filteredAlbumIds}
									stats={[songs.Stats["SongCountByAlbumId"]]}
									filters={filteredArtists.map((artist) => (album) => (album.Artists ?? []).indexOf(artist) > -1)}
									onToggled={(album) => { Nullable.TryExecute(album.Id, (id) => observableAlbumIds.toggle(id)); }}
									columns={[
										{ name: "Album", getValue: (i) => i.Name, width: "40%", align: "start", getSortFunc: () => SortByString((i) => i.Name) },
										{ name: "Artist", getValue: (i) => i.AlbumArtist, width: "40%", align: "start", getSortFunc: () => SortByString((i) => i.AlbumArtist) },
										{ name: "LabelYear", getValue: (i) => i.ProductionYear, width: "10%", align: "center", getSortFunc: () => SortByNumber((i) => i.ProductionYear) },
										{ name: "Songs", getValue: (album, stats) => Nullable.ValueOrDefault(stats[0][album.Id ?? ""], 0, (n) => n), width: "10%", align: "center", getSortFunc: (stats) => SortByNumber((album) => Nullable.ValueOrDefault(stats[0][album.Id ?? ""], 0, (n) => n)) },
									]}
								/>
							)}
						/>
					</Layout>
				</Layout>

				<Layout direction="row" className={background.panel} grow py="1em" px="1em" alignItems="center" justifyContent="center">
					<Loading
						receivers={[audioList.List]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon size="4em" />}
						whenNotStarted={<LoadingIcon size="4em" />}
						whenReceived={(audios) => (
							<LoadedItems
								addType="AudioId"
								items={audios.List}
								selectedKeys={[]}
								getSelectedKey={() => ""}
								onToggled={(audio) => { MusicPlayer.Instance.AddRange([audio]); }}
								filters={filteredArtists.map((artist) => (song: BaseItemDto) => (song.Artists ?? []).indexOf(artist) > -1).concat(filteredAlbumIds.map((albumId) => (song: BaseItemDto) => song.AlbumId === albumId))}
								columns={[
									{ name: "Songs", getValue: (i) => i.Name, width: "30%", align: "start", getSortFunc: () => SortByString((i) => i.Name) },
									{ name: "Album", getValue: (i) => i.Album, width: "30%", align: "start", getSortFunc: () => SortByString((i) => i.Album) },
									{ name: "Artist", getValue: (i) => Nullable.ValueOrDefault(i.Artists, [], a => a).join(", "), width: "25%", align: "start", getSortFunc: () => SortByString((i) => Nullable.ValueOrDefault(i.Artists, [], a => a).join(", ")) },
									{ name: "LabelDuration", getValue: (i) => DateTime.ConvertTicksToDurationString(i.RunTimeTicks), width: "5%", align: "center", getSortFunc: () => SortByNumber((i) => i.RunTimeTicks) },
									{ name: "Track", getValue: (i) => i.IndexNumber, width: "5%", align: "center", getSortFunc: () => SortByNumber((i) => i.IndexNumber) },
									{ name: "LabelYear", getValue: (i) => i.ProductionYear, width: "5%", align: "center", getSortFunc: () => SortByNumber((i) => i.ProductionYear) },
								]}
							/>
						)}
					/>
				</Layout>
			</Layout>
		</Layout>
	);
};

const CurrentPlaylist: React.FC<{ user: UserDto, className: string; library: BaseItemDto }> = (props) => {
	const background = useBackgroundStyles();
	const itemsInPlaylist = useObservable(MusicPlayer.Instance.Playlist);
	const current = useObservable(MusicPlayer.Instance.Current);
	const playState = useObservable(MusicPlayer.Instance.State);

	return (
		<Layout direction="column" className={props.className} grow py="1em" px="1em" gap="1em">
			<Layout direction="row" justifyContent="space-between">
				<Layout direction="row" alignItems="center" gap=".5em" fontSize="1.5em">
					<PlaylistIcon />
					<TranslatedText textKey="LabelPlaylist" elementType="div" />
				</Layout>

				<Layout direction="row">
					<ItemActionsMenu
						items={itemsInPlaylist.map((p) => p.Item)}
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

			<Layout
				direction="column" grow
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

					const addAfterIndex = Nullable.ValueOrDefault((evt.target as HTMLElement).closest("*[data-index]") as HTMLElement|undefined|null, undefined, (element) => {
						const index = parseInt(element.attributes.getNamedItem("data-index")?.value ?? "0", 10);
						const elementMidpoint = element.getBoundingClientRect().height / 2;
						element.style.borderStyle = "";

						return evt.nativeEvent.offsetY > elementMidpoint ? index + 1 : index;
					});

					MusicPlayer.Instance.AddFromId(evt.dataTransfer.getData("AddType") as AddPlaylistItemType, evt.dataTransfer.getData("AddTypeId"), props.library, addAfterIndex);
				}}
			>
				{itemsInPlaylist.length > 0 ? (
					<Virtuoso
						data={itemsInPlaylist}
						totalCount={itemsInPlaylist.length}
						style={{ height: "100%", width: "100%" }}
						itemContent={(index, data) => (
							<Layout direction="row" position="relative" draggable onDragStart={(evt) => { evt.dataTransfer.setData("AddType", "PlaylistId"); evt.dataTransfer.setData("AddTypeId", index.toString()); }}>
								<Layout direction="column" alignItems="center" justifyContent="center" position="absolute" top={0} bottom={0} left={0} width="5%">
									{Nullable.ValueOrDefault(current, <DragIcon />, (c) => c.PlaylistItem === data ? <PlayStateIcon state={playState} /> : <DragIcon />)}
								</Layout>

								<Button transparent width="100%" px="5%" type="button" textAlign="start" onClick={() => { MusicPlayer.Instance.GoIndex(index)}}>
									<Layout direction="column" px=".5em" py=".5em" width="80%">{data.Item.Name}</Layout>
									<Layout direction="column" px=".5em" py=".5em" alignItems="end" width="20%">{DateTime.ConvertTicksToDurationString(data.Item.RunTimeTicks)}</Layout>
								</Button>

								<Button
									type="button" onClick={() => { MusicPlayer.Instance.Remove(data); }}
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
		</Layout>
	);
};

const LoadedItems: React.FC<{ addType: AddPlaylistItemType, items: BaseItemDto[]; columns: Column[]; stats?: Record<string, number>[]; selectedKeys: readonly string[]; getSelectedKey: (item: BaseItemDto) => string; onToggled: (item: BaseItemDto) => void; filters?: ((item: BaseItemDto) => boolean)[] }> = (props) => {
	const background = useBackgroundStyles();
	const [sortField, setSortField] = React.useState(props.columns[0]);
	const [sortReversed, setSortReversed] = React.useState(false);

	const setSortForColumn = (column: Column) => {
		if (sortField === column) {
			setSortReversed(!sortReversed);
		} else {
			setSortField(column);
			setSortReversed(false);
		}
	};

	const filteredItems = React.useMemo(() => props.items.filter((i) => Nullable.ValueOrDefault(props.filters, true, (f) => f.length === 0 || f.some((filter) => filter(i) || props.selectedKeys.includes(props.getSelectedKey(i))))), [props.items, props.filters, props.selectedKeys, props.getSelectedKey]);
	const sortedItems = React.useMemo(() => SortByObjects(filteredItems, [{ LabelKey: sortField.name, Sort: sortField.getSortFunc(props.stats ?? []), Reversed: sortReversed }]), [filteredItems, sortField, sortReversed]);

	return (
		<TableVirtuoso
			data={sortedItems}
			totalCount={props.items.length}
			style={{ height: "100%", width: "100%" }}
			components={{ 
				Table: ({ style, ...tProps }: TableProps) => <table {...tProps} style={{ ...style, width: "100%" }} />,
				TableRow: ({ style, item, ...trProps }: ItemProps<BaseItemDto>) => (
					<tr
						{...trProps}
						style={{ ...style }}
						className={props.selectedKeys.includes(props.getSelectedKey(item)) ? background.selected : background.transparent}
						draggable onDragStart={(evt) => { evt.dataTransfer.setData("AddType", props.addType); evt.dataTransfer.setData("AddTypeId", (props.addType === "ArtistName" ? item.Name : item.Id) ?? ""); }}
						onClick={() => { props.onToggled(item); }}
					/>
				),
			}}
			itemContent={(_, data) => (
				<>
					{props.columns.map((column) => (
						<Layout key={column.name} elementType="td" display="table-cell" px=".5em" py=".25em" direction="row" textAlign={column.align} width={column.width}>
							{column.getValue(data, props.stats ?? [])}
						</Layout>
					))}
				</>
			)}
			fixedHeaderContent={() => (
				<tr className={background.alternatePanel}>
					{props.columns.map((column) => (
						<Layout key={column.name} elementType="th" display="table-cell" width={column.width} direction="row">
							<Button type="button" onClick={() => { setSortForColumn(column); }} transparent width="100%" px=".5em" py=".5em" justifyContent={column.align} label={column.name} />
						</Layout>
					))}
				</tr>
			)}
		/>
	);
};
