import * as React from "react";
import { ItemProps, TableProps, TableVirtuoso } from "react-virtuoso";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "PageWithNavigation";
import { Loading } from "Common/Loading";
import { ItemService } from "Items/ItemsService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { Settings } from "Users/SettingsStore";
import { Layout } from "Common/Layout";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { Button } from "Common/Button";
import { useObservable } from "@residualeffect/rereactor";
import { PageTitle } from "Common/PageTitle";
import { ReverseSort, SortByNumber, SortByString } from "Common/ArrayPrototype";
import { ObservableArray } from "@residualeffect/reactor";
import { MusicPlayerService } from "Music/MusicPlayerService";
import { PlaylistDragItemsFunc } from "MediaPlayer/MediaPlayerPlaylist";
import { SortByIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";

export const SongListView: React.FC = () => {
	const libraryId = useParams().libraryId!;

	return (
		<PageWithNavigation icon="Audio" matchHeight content={(libraries, user, settings) => <SongListViewContent libraryId={libraryId} settings={settings} user={user} libraries={libraries} />} />
	);
};

interface Column {
	name: string;
	getValue: (item: BaseItemDto, stats: Record<string, number>[]) => React.ReactNode;
	align?: "start"|"end"|"center";
	width?: string;
	getSortFunc: (stats: Record<string, number>[]) => (a: BaseItemDto, b: BaseItemDto) => number;
}

export const SongListViewContent: React.FC<{ libraryId: string; libraries: BaseItemDto[]; user: UserDto; settings: Settings; }> = ({ libraryId, libraries }) => {
	const library = libraries.single((l) => l.Id === libraryId);

	const albumList = ItemService.Instance.FindOrCreateListFromLibrary(library);
	const artistList = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "MusicArtists", DataSourceKey: libraryId });
	const audioList = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "MusicSongs", DataSourceKey: libraryId });

	React.useEffect(() => artistList.LoadWithAbort(), [artistList]);
	React.useEffect(() => albumList.LoadWithAbort([{ Key: "AlbumCountByArtistId", GetKeysForItem: (i) => i.AlbumArtists?.map((a) => a.Id) ?? [] }]), [albumList]);
	React.useEffect(() => audioList.LoadWithAbort([{ Key: "SongCountByArtistId", GetKeysForItem: (i) => i.Artists?.map((a) => a) ?? [] }, { Key: "SongCountByAlbumId", GetKeysForItem: (i) => [i.AlbumId] }]), [audioList]);

	const observableArtists = React.useMemo(() => new ObservableArray<string>([]), [libraryId]);
	const observableAlbumIds = React.useMemo(() => new ObservableArray<string>([]), [libraryId]);

	const filteredArtists = useObservable(observableArtists);
	const filteredAlbumIds = useObservable(observableAlbumIds);

	return (
		<Layout direction="column" height="100%" py="1em" gap="1em">
			<PageTitle text={library.Name} suppressOnScreen />

			<Layout direction="row" gap="1em" height="25%">
				<Layout direction="column" backgroundColor="Panel" bt br bb bl grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
					<Loading
						receivers={[artistList.List, albumList.List, audioList.List]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon size="4em" />}
						whenNotStarted={<LoadingIcon size="4em" />}
						whenReceived={(artists, albums, songs) => (
							<LoadedItems
								libraryId={libraryId}
								items={artists.List}
								selectedKeys={filteredArtists}
								getSelectedKey={(i) => i.Name!}
								audioItemsInOrder={(item) => songs.List.filter((s) => s.ArtistItems?.some((ai) => ai.Id === item.Id))}
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
				<Layout direction="row" backgroundColor="Panel" bt br bb bl grow basis={0} py="1em" px="1em" alignItems="center" justifyContent="center">
					<Loading
						receivers={[albumList.List, audioList.List]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon size="4em" />}
						whenNotStarted={<LoadingIcon size="4em" />}
						whenReceived={(albums, songs) => (
							<LoadedItems
								libraryId={libraryId}
								items={albums.List}
								getSelectedKey={(i) => i.Id!}
								selectedKeys={filteredAlbumIds}
								audioItemsInOrder={(item) => songs.List.filter((s) => s.AlbumId === item.Id)}
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

			<Layout direction="row" backgroundColor="Panel" bt br bb bl grow py="1em" px="1em" alignItems="center" justifyContent="center">
				<Loading
					receivers={[audioList.List]}
					whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
					whenLoading={<LoadingIcon size="4em" />}
					whenNotStarted={<LoadingIcon size="4em" />}
					whenReceived={(audios) => (
						<LoadedItems
							libraryId={libraryId}
							items={audios.List}
							selectedKeys={[]}
							getSelectedKey={() => ""}
							audioItemsInOrder={(item) => [item]}
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

const LoadedItems: React.FC<{ libraryId: string; items: BaseItemDto[]; columns: Column[]; stats?: Record<string, number>[]; selectedKeys: readonly string[]; getSelectedKey: (item: BaseItemDto) => string; onToggled: (item: BaseItemDto) => void; filters?: ((item: BaseItemDto) => boolean)[]; audioItemsInOrder: (item: BaseItemDto) => BaseItemDto[] }> = (props) => {
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
	const sortedItems = React.useMemo(() => filteredItems.sortBy([sortReversed ? ReverseSort(sortField.getSortFunc(props.stats ?? [])) : sortField.getSortFunc(props.stats ?? [])]), [filteredItems, sortField, sortReversed]);

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
						draggable onDragStart={PlaylistDragItemsFunc(() => props.audioItemsInOrder(item).sort(SortByIndexNumber.sortFunc))}
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
				<Layout elementType="tr" display="table-row" backgroundColor="AlternatePanel" direction="row">
					{props.columns.map((column) => (
						<Layout key={column.name} elementType="th" display="table-cell" width={column.width} direction="row">
							<Button type="button" onClick={() => { setSortForColumn(column); }} transparent width="100%" px=".5em" py=".5em" justifyContent={column.align} label={column.name} />
						</Layout>
					))}
				</Layout>
			)}
		/>
	);
};
