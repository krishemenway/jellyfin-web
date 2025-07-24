import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicAlbumIcon } from "Music/MusicAlbumIcon";
import { ImageShape } from "Items/ItemImage";

export const MusicAlbumService: BaseItemKindService = {
	primaryShape: ImageShape.Square,
	findIcon: (props) => <MusicAlbumIcon {...props} />,
	findUrl: (item) => `/Music/Album/${item.Id}`,
};
