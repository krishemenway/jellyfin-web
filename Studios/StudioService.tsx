import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { StudioIcon } from "Studios/StudioIcon";
import { getStudiosApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

export const StudioService: BaseItemKindService = {
	findIcon: (props) => <StudioIcon {...props} />,
	loadList: (a, libraryId) => getStudiosApi(ServerService.Instance.CurrentApi).getStudios({ parentId: libraryId }, { signal: a.signal }).then((response) => response.data.Items ?? []),
};
