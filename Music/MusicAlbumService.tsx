import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicAlbumIcon } from "Music/MusicAlbumIcon";

export const MusicAlbumService: BaseItemKindService = {
	findIcon: (props) => <MusicAlbumIcon {...props} />,
	findUrl: (item) => `/Music/Album/${item.Id}`,
};
