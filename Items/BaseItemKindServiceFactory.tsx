import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { AudioBookService } from "Books/AudioBookService";
import { BookService } from "Books/BookService";
import { AggregateFolderService } from "Collections/AggregateFolderService";
import { BoxSetService } from "Collections/BoxSetService";
import { CollectionFolderService } from "Collections/CollectionFolderService";
import { FolderService } from "Collections/FolderService";
import { GenreService } from "Genres/GenreService";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { BasePluginFolderService } from "Items/BasePluginFolderService";
import { UserRootFolderService } from "Items/UserRootFolderService";
import { UserViewService } from "Items/UserViewService";
import { YearService } from "Items/YearService";
import { ChannelFolderItemService } from "Shows/ChannelFolderItemService";
import { ChannelService } from "Shows/ChannelService";
import { LiveTVChannelService } from "Shows/LiveTVChannelService";
import { LiveTVProgramService } from "Shows/LiveTVProgramService";
import { RecordingService } from "Movies/RecordingService";
import { MovieService } from "Movies/MovieService";
import { TrailerService } from "Movies/TrailerService";
import { VideoService } from "Videos/VideoService";
import { AudioService } from "Music/AudioService";
import { MusicAlbumService } from "Music/MusicAlbumService";
import { MusicArtistService } from "Music/MusicArtistService";
import { MusicGenreService } from "Music/MusicGenreService";
import { MusicVideoService } from "Music/MusicVideoService";
import { PersonService } from "People/PersonService";
import { PhotoAlbumService } from "Photos/PhotoAlbumService";
import { PhotoService } from "Photos/PhotoService";
import { ManualPlaylistsFolderService } from "Playlists/ManualPlaylistsFolderService";
import { PlaylistService } from "Playlists/PlaylistService";
import { PlaylistsFolderService } from "Playlists/PlaylistsFolderService";
import { EpisodeService } from "Shows/EpisodeService";
import { SeasonService } from "Shows/SeasonService";
import { ShowService } from "Shows/ShowService";
import { StudioService } from "Studios/StudioService";

export class BaseItemKindServiceFactory {
	public static FindOrNull(kind?: BaseItemKind): BaseItemKindService|null {
		if (kind === undefined) {
			return null;
		}

		return this._servicesByKind[kind] ?? null;
	}

	private static _servicesByKind: Record<BaseItemKind, BaseItemKindService> = {
		"AggregateFolder": AggregateFolderService,
		"Audio": AudioService,
		"AudioBook": AudioBookService,
		"BasePluginFolder": BasePluginFolderService,
		"Book": BookService,
		"BoxSet": BoxSetService,
		"Channel": ChannelService,
		"ChannelFolderItem": ChannelFolderItemService,
		"CollectionFolder": CollectionFolderService,
		"Episode": EpisodeService,
		"Folder": FolderService,
		"Genre": GenreService,
		"ManualPlaylistsFolder": ManualPlaylistsFolderService,
		"Movie": MovieService,
		"LiveTvChannel": LiveTVChannelService,
		"LiveTvProgram": LiveTVProgramService,
		"MusicAlbum": MusicAlbumService,
		"MusicArtist": MusicArtistService,
		"MusicGenre": MusicGenreService,
		"MusicVideo": MusicVideoService,
		"Person": PersonService,
		"Photo": PhotoService,
		"PhotoAlbum": PhotoAlbumService,
		"Playlist": PlaylistService,
		"PlaylistsFolder": PlaylistsFolderService,
		"Program": LiveTVProgramService,
		"Recording": RecordingService,
		"Season": SeasonService,
		"Series": ShowService,
		"Studio": StudioService,
		"Trailer": TrailerService,
		"TvChannel": LiveTVChannelService,
		"TvProgram": LiveTVProgramService,
		"UserRootFolder": UserRootFolderService,
		"UserView": UserViewService,
		"Video": VideoService,
		"Year": YearService,
	};
}
