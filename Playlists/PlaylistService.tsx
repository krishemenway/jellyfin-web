import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PlaylistIcon } from "Playlists/PlaylistIcon";

export const PlaylistService: BaseItemKindService = {
	findIcon: (props) => <PlaylistIcon {...props} />,
};
