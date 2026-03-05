import * as React from "react";
import { ItemProps, TableProps, TableVirtuoso } from "react-virtuoso";
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
import { Button } from "Common/Button";
import { useObservable } from "@residualeffect/rereactor";
import { PageTitle } from "Common/PageTitle";
import { UserViewStore } from "Users/UserViewStore";
import { SortByNumber, SortByObjects, SortByString } from "Common/Sort";
import { ObservableArray } from "@residualeffect/reactor";
import { ServerService } from "Servers/ServerService";
import { MusicPlayerDropActionType, MusicPlayerService } from "Music/MusicPlayerService";

export const SongListView: React.FC = () => {
	const libraryId = useParams().libraryId;
	const userId = useObservable(ServerService.Instance.CurrentUserId);

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon="Audio" matchHeight><NotFound /></PageWithNavigation>;
	}

	const albumList = ItemService.Instance.FindOrCreateItemList(libraryId, "MusicAlbum");
	const artistList = ItemService.Instance.FindOrCreateItemList(libraryId, "MusicArtist");
	const songList = ItemService.Instance.FindOrCreateItemList(libraryId, "Audio");

	React.useEffect(() => artistList.LoadWithAbort(), [artistList]);
	React.useEffect(() => albumList.LoadWithAbort([{ Key: "AlbumCountByArtistId", GetKeysForItem: (i) => i.AlbumArtists?.map((a) => a.Id) ?? [] }]), [albumList]);
	React.useEffect(() => songList.LoadWithAbort([{ Key: "SongCountByArtistId", GetKeysForItem: (i) => i.Artists?.map((a) => a) ?? [] }, { Key: "SongCountByAlbumId", GetKeysForItem: (i) => [i.AlbumId] }]), [songList]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings(libraryId), [libraryId]);
	React.useEffect(() => UserViewStore.Instance.LoadUserViewsWithAbort(userId), [userId]);

	return (
		<PageWithNavigation icon="Audio" matchHeight>
			<Loading
				receivers={[SettingsStore.Instance.Settings, LoginService.Instance.User, UserViewStore.Instance.FindOrCreateForUser(userId)]}
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
		<Layout direction="column" height="100%" py="1em" gap="1em">
			<PageTitle text={library.Name} suppressOnScreen />

			<Layout direction="row" gap="1em" height="25%">
				<Layout direction="column" className={background.panel} grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
					<Loading
						receivers={[artistList.List, albumList.List, audioList.List]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon size="4em" />}
						whenNotStarted={<LoadingIcon size="4em" />}
						whenReceived={(artists, albums, songs) => (
							<LoadedItems
								addType="ArtistName-SongList"
								libraryId={props.libraryId}
								items={artists.List}
								selectedKeys={filteredArtists}
								getSelectedKey={(i) => i.Name!}
								stats={[albums.Stats["AlbumCountByArtistId"], songs.Stats["SongCountByArtistId"]]}
								onToggled={(artist) => { Nullable.TryExecute(artist.Name, (name) => observableArtists.toggle(name)); }}
								columns={[
									{ name: "Artist", getValue: (i) => i.Name, width: "80%", align: "start", getSortFunc: () => SortByString((i) => i.Name) },
									{ name: "Albums", getValue: (artist, stats) => Nullable.Value(stats[0][artist.Id ?? ""], 0, (n) => n), width: "10%", align: "center", getSortFunc: (stats) => SortByNumber((artist) => Nullable.Value(stats[0][artist.Id ?? ""], 0, (n) => n)) },
									{ name: "Songs", getValue: (artist, stats) => Nullable.Value(stats[1][artist.Name ?? ""], 0, (n) => n), width: "10%", align: "center", getSortFunc: (stats) => SortByNumber((artist) => Nullable.Value(stats[1][artist.Name ?? ""], 0, (n) => n)) },
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
								addType="AlbumId-SongList"
								libraryId={props.libraryId}
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
									{ name: "Songs", getValue: (album, stats) => Nullable.Value(stats[0][album.Id ?? ""], 0, (n) => n), width: "10%", align: "center", getSortFunc: (stats) => SortByNumber((album) => Nullable.Value(stats[0][album.Id ?? ""], 0, (n) => n)) },
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
							addType="AudioId-SongList"
							libraryId={props.libraryId}
							items={audios.List}
							selectedKeys={[]}
							getSelectedKey={() => ""}
							onToggled={(audio) => { MusicPlayerService.Instance.ClearAndPlay([audio]); }}
							filters={filteredArtists.map((artist) => (song: BaseItemDto) => (song.Artists ?? []).indexOf(artist) > -1).concat(filteredAlbumIds.map((albumId) => (song: BaseItemDto) => song.AlbumId === albumId))}
							columns={[
								{ name: "Songs", getValue: (i) => i.Name, width: "30%", align: "start", getSortFunc: () => SortByString((i) => i.Name) },
								{ name: "Album", getValue: (i) => i.Album, width: "30%", align: "start", getSortFunc: () => SortByString((i) => i.Album) },
								{ name: "Artist", getValue: (i) => Nullable.Value(i.Artists, [], a => a).join(", "), width: "25%", align: "start", getSortFunc: () => SortByString((i) => Nullable.Value(i.Artists, [], a => a).join(", ")) },
								{ name: "LabelDuration", getValue: (i) => DateTime.ConvertTicksToDurationString(i.RunTimeTicks), width: "5%", align: "center", getSortFunc: () => SortByNumber((i) => i.RunTimeTicks) },
								{ name: "Track", getValue: (i) => i.IndexNumber, width: "5%", align: "center", getSortFunc: () => SortByNumber((i) => i.IndexNumber) },
								{ name: "LabelYear", getValue: (i) => i.ProductionYear, width: "5%", align: "center", getSortFunc: () => SortByNumber((i) => i.ProductionYear) },
							]}
						/>
					)}
				/>
			</Layout>
		</Layout>
	);
};

const LoadedItems: React.FC<{ addType: MusicPlayerDropActionType, libraryId: string; items: BaseItemDto[]; columns: Column[]; stats?: Record<string, number>[]; selectedKeys: readonly string[]; getSelectedKey: (item: BaseItemDto) => string; onToggled: (item: BaseItemDto) => void; filters?: ((item: BaseItemDto) => boolean)[] }> = (props) => {
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

	const filteredItems = React.useMemo(() => props.items.filter((i) => Nullable.Value(props.filters, true, (f) => f.length === 0 || f.some((filter) => filter(i) || props.selectedKeys.includes(props.getSelectedKey(i))))), [props.items, props.filters, props.selectedKeys, props.getSelectedKey]);
	const sortedItems = React.useMemo(() => SortByObjects(filteredItems, [{ SortType: sortField.name, LabelKey: sortField.name, Sort: sortField.getSortFunc(props.stats ?? []), Reversed: sortReversed }]), [filteredItems, sortField, sortReversed]);

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
						draggable onDragStart={(evt) => { evt.dataTransfer.setData("AddType", props.addType); evt.dataTransfer.setData("AddFromLibrary", props.libraryId); evt.dataTransfer.setData("AddTypeId", (props.addType === "ArtistName-SongList" ? item.Name : item.Id) ?? ""); }}
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
