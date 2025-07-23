import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicIcon } from "Music/MusicIcon";
import { MovieIcon } from "Movies/MovieIcon";
import { PhotoIcon } from "Photos/PhotoIcon";
import { DVRIcon } from "Shows/DVRIcon";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";
import { CollectionIcon } from "Collections/CollectionIcon";

export const CollectionFolderService: BaseItemKindService = {
	findIcon: (props, collectionType) => {
		switch (collectionType) {
			case "boxsets": return <CollectionIcon {...props} />
			case "music": return <MusicIcon {...props} />;
			case "movies": return <MovieIcon {...props} />;
			case "photos": return <PhotoIcon {...props} />;
			case "tvshows": return <DVRIcon {...props} />;
			default: return <QuestionMarkIcon {...props} />;
		}
	},
	sortOptions: [ ],
	findUrl: (item) => {
		switch(item.CollectionType) {
			case "movies": return `/Movies/${item.Id}`;
			case "tvshows": return `/Shows/${item.Id}`;
			case "music": return `/Music/${item.Id}`;
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
