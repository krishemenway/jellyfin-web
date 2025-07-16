import * as React from "react";
import { BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import ArtistIcon from "Music/ArtistIcon";
import MusicIcon from "Music/MusicIcon";
import MovieIcon from "Movies/MovieIcon";
import PhotoIcon from "PhotoAlbum/PhotoIcon";
import DVRIcon from "Shows/DVRIcon";
import QuestionMarkIcon from "Common/QuestionMarkIcon";
import CollectionIcon from "Collections/CollectionIcon";
import PlaylistIcon from "Playlists/PlaylistIcon";
import AlbumIcon from "Music/MusicAlbumIcon";
import PhotoAlbumIcon from "PhotoAlbum/PhotoAlbumIcon";
import TVIcon from "Shows/TVIcon";

const IconForItemType : React.FC<{ itemType?: BaseItemKind, collectionType?: CollectionType }&IconProps> = (props) => {
	switch (props.itemType) {
		case "CollectionFolder":
			switch(props.collectionType) {
				case "music": return <MusicIcon  {...props} />;
				case "movies": return <MovieIcon {...props} />;
				case "photos": return <PhotoIcon {...props} />;
				case "tvshows": return <DVRIcon {...props} />;
				default: return <QuestionMarkIcon {...props} />;
			}
		case "MusicArtist": return <ArtistIcon {...props} />;
		case "MusicAlbum": return <AlbumIcon {...props} />;
		case "Series": return <DVRIcon {...props} />;
		case "Episode": return <TVIcon {...props} />;
		case "Photo": return <PhotoIcon {...props} />;
		case "PhotoAlbum": return <PhotoAlbumIcon {...props} />;
		case "Movie": return <MovieIcon {...props} />;
		case "AggregateFolder": return <CollectionIcon {...props} />;
		case "Playlist": return <PlaylistIcon {...props} />;
		default: return <QuestionMarkIcon {...props} />;
	}
}

export default IconForItemType;
