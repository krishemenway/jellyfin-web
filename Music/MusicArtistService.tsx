import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicArtistIcon } from "Music/MusicArtistIcon";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

export const MusicArtistService: BaseItemKindService = {
	findIcon: (props) => <MusicArtistIcon {...props} />,
	findUrl: (i) => `/Music/Artist/${i.Id}`,
};

export function FindArtistsForLibrary(abort: AbortController, id: string): Promise<BaseItemDto[]> {
	return getArtistsApi(ServerService.Instance.CurrentApi).getArtists({ parentId: id }, { signal: abort.signal }).then((result) => result.data.Items ?? []);
}
