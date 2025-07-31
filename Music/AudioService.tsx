import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicIcon } from "Music/MusicIcon";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { ServerService } from "Servers/ServerService";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export const AudioService: BaseItemKindService = {
	findIcon: (props) => <MusicIcon {...props} />,
};

export function FindSongsForLibrary(abort: AbortController, id: string): Promise<BaseItemDto[]> {
	return getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: id, recursive: true, includeItemTypes: ["Audio"], fields: ["DateCreated", "Genres", "Tags"] }, { signal: abort.signal }).then((response) => response.data.Items ?? []);
}
