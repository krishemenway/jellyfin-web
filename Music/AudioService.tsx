import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicIcon } from "Music/MusicIcon";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { ServerService } from "Servers/ServerService";

export const AudioService: BaseItemKindService = {
	findIcon: (props) => <MusicIcon {...props} />,
	loadList: (a, id) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: id, recursive: true, includeItemTypes: ["Audio"], fields: ["DateCreated", "Genres", "Tags"] }, { signal: a.signal }).then((response) => response.data.Items ?? []),
};
