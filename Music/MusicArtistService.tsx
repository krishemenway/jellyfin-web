import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicArtistIcon } from "Music/MusicArtistIcon";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

export const MusicArtistService: BaseItemKindService = {
	findIcon: (props) => <MusicArtistIcon {...props} />,
	findUrl: (i) => `/Music/Artist/${i.Id}`,
	loadList: (a, id) => getArtistsApi(ServerService.Instance.CurrentApi).getArtists({ parentId: id }, { signal: a.signal }).then((result) => result.data.Items ?? []),
};
