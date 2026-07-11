import { BaseItemDto, BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
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
import { Nullable } from "Common/MissingJavascriptFunctions";

export const defaultNameFunc: (item: BaseItemDto) => string = (item) => item.Name ?? "";
export class BaseItemKindServiceFactory {
	public static FindOrThrow(kind?: BaseItemKind|string): BaseItemKindService {
		const result = BaseItemKindServiceFactory.FindOrNull(kind);

		if (!Nullable.HasValue(result)) {
			throw new Error(`Missing Service for type ${kind}`);
		}

		return result;
	}

	public static FindOrNull(kind?: BaseItemKind|string): BaseItemKindService|null {
		if (kind === undefined) {
			return null;
		}

		return this._servicesByKind[kind as BaseItemKind] ?? null;
	}

	private static _servicesByKind: Record<BaseItemKind, BaseItemKindService> = [
		AggregateFolderService,
		AudioService,
		AudioBookService,
		BasePluginFolderService,
		BookService,
		BoxSetService,
		ChannelService,
		ChannelFolderItemService,
		CollectionFolderService,
		EpisodeService,
		FolderService,
		GenreService,
		ManualPlaylistsFolderService,
		MovieService,
		LiveTVChannelService,
		LiveTVProgramService,
		MusicAlbumService,
		MusicArtistService,
		MusicGenreService,
		MusicVideoService,
		PersonService,
		PhotoService,
		PhotoAlbumService,
		PlaylistService,
		PlaylistsFolderService,
		LiveTVProgramService,
		RecordingService,
		SeasonService,
		ShowService,
		StudioService,
		TrailerService,
		LiveTVChannelService,
		LiveTVProgramService,
		UserRootFolderService,
		CollectionFolderService,
		VideoService,
		YearService,
	].toRecord(s => s.kind);
}
