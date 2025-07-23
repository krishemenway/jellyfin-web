import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PhotoAlbumIcon } from "Photos/PhotoAlbumIcon";

export const PhotoAlbumService: BaseItemKindService = {
	findIcon: (props) => <PhotoAlbumIcon {...props} />,
};
