import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { IconProps } from "Common/IconProps";
import { AudioService } from "Music/AudioService";
import { MovieService } from "Movies/MovieService";
import { PhotoService } from "Photos/PhotoService";
import { ShowService } from "Shows/ShowService";
import { TrailerService } from "Movies/TrailerService";
import { RecordingService } from "Movies/RecordingService";
import { BookService } from "Books/BookService";
import { PlaylistService } from "Playlists/PlaylistService";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";
import { FolderService } from "Collections/FolderService";
import { CollectionIcon } from "Collections/CollectionIcon";

export const CollectionFolderService: BaseItemKindService = {
	findIcon: (props, collectionType) => {
		switch (collectionType?.toLowerCase()) {
			case "boxsets": return <CollectionIcon {...props} />;
			case "music": return DelegateToServiceOrUndefined(props, AudioService);
			case "movies": return DelegateToServiceOrUndefined(props, MovieService);
			case "photos": return DelegateToServiceOrUndefined(props, PhotoService);
			case "tvshows": return DelegateToServiceOrUndefined(props, ShowService);
			case "trailers": return DelegateToServiceOrUndefined(props, TrailerService);
			case "homevideos": return DelegateToServiceOrUndefined(props, RecordingService);
			case "books": return DelegateToServiceOrUndefined(props, BookService);
			case "playlists": return DelegateToServiceOrUndefined(props, PlaylistService);
			case "folders": return DelegateToServiceOrUndefined(props, FolderService);
			default: return <QuestionMarkIcon {...props} />;
		}
	},
	sortOptions: [ ],
	findUrl: (item) => {
		switch(item.CollectionType?.toLowerCase()) {
			case "movies": return `/Movies/${item.Id}`;
			case "tvshows": return `/Shows/${item.Id}`;
			case "music": return `/Music/Albums/${item.Id}`;
			case "musicvideos": return `/MusicVideos/${item.Id}`;
			case "trailers": return `/Trailers/${item.Id}`;
			case "homevideos": return `/HomeVideos/${item.Id}`;
			case "boxsets": return `/Collections/${item.Id}`;
			case "books": return `/Books/${item.Id}`;
			case "photos": return `/Photos/${item.Id}`;
			case "livetv": return `/LiveTV/${item.Id}`;
			case "playlists": return `/Playlists/${item.Id}`;
			case "folders": return `/Folders/${item.Id}`;
			default: throw new Error("Missing url for item " + item.Name);
		}
	}
};

function DelegateToServiceOrUndefined(props: IconProps, itemKindService: BaseItemKindService) {
	if (itemKindService.findIcon === undefined) {
		return <QuestionMarkIcon {...props} />;
	}

	return itemKindService.findIcon(props);
}
