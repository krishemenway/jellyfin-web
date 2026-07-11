import { BaseItemDto, BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { IconProps } from "Common/IconProps";
import { BookCollectionService } from "Books/BookService";
import { MovieCollectionService } from "Movies/MovieService";
import { MusicCollectionService } from "Music/AudioService";
import { MusicVideoCollectionService } from "Music/MusicVideoService";
import { BoxSetCollectionService } from "Collections/BoxSetService";
import { ShowCollectionService } from "Shows/ShowService";
import { FolderCollectionService } from "Collections/FolderService";
import { HomeVideosCollectionService } from "Collections/HomeVideosCollectionService";
import { PlaylistCollectionService } from "Playlists/PlaylistService";

export interface CollectionTypeService {
	type: CollectionType;
	listUrl: (libraryId: string) => string;
	loadList?: (a: AbortController, libraryId: string) => Promise<BaseItemDto[]>;
	listTypes?: BaseItemKind[];
	findIcon?: (iconProps: IconProps) => React.ReactNode;
}

export class CollectionServiceFactory {
	public static FindOrNullByCollectionType(collectionType?: CollectionType): CollectionTypeService|null {
		if (collectionType === undefined) {
			return null;
		}

		return CollectionServiceFactory._servicesByCollection[collectionType] ?? null;
	}

	public static FindOrThrowByCollectionType(collectionType?: CollectionType): CollectionTypeService {
		const result = CollectionServiceFactory.FindOrNullByCollectionType(collectionType);

		if (!Nullable.HasValue(result)) {
			throw new Error(`Missing Service for collection type ${collectionType}`);
		}

		return result;
	}

	private static _servicesByCollection: Record<CollectionType, CollectionTypeService> = [
		BoxSetCollectionService,
		MusicCollectionService,
		MusicVideoCollectionService,
		MovieCollectionService,
		ShowCollectionService,
		HomeVideosCollectionService,
		BookCollectionService,
		PlaylistCollectionService,
		FolderCollectionService,
	].toRecord(c => c.type);
}
