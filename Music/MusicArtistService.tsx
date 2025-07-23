import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicArtistIcon } from "Music/MusicArtistIcon";

export const MusicArtistService: BaseItemKindService = {
	findIcon: (props) => <MusicArtistIcon {...props} />,
};
