import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { MusicIcon } from "Music/MusicIcon";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { ServerService } from "Servers/ServerService";
import { ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models/item-sort-by";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";

const BatchSize = 1000;
function LoadMusicInBatches(abort: AbortController, libraryId: string): Promise<BaseItemDto[]> {
	return new Promise((onResolved, onFailure) => {
		const allItems: BaseItemDto[] = [];
		getItemsApi(ServerService.Instance.CurrentApi).getItems({ limit: BatchSize, startIndex: 0, parentId: libraryId, enableTotalRecordCount: true, recursive: true, includeItemTypes: ["Audio"], fields: ["DateCreated", "Genres", "Tags"], sortBy: [ItemSortBy.SortName] }, { signal: abort.signal })
			.then(async (initialResult) => {
				if (!Nullable.HasValue(initialResult.data.TotalRecordCount) || initialResult.data.TotalRecordCount === 0) {
					onResolved([]);
					return;
				}

				allItems.push(...initialResult.data.Items ?? [])
				const totalBatches = Math.ceil(initialResult.data.TotalRecordCount / BatchSize);

				for (let batchIndex = 1; batchIndex < totalBatches; batchIndex++) {
					await getItemsApi(ServerService.Instance.CurrentApi).getItems({ limit: BatchSize, startIndex: BatchSize * batchIndex, parentId: libraryId, recursive: true, includeItemTypes: ["Audio"], fields: ["DateCreated", "Genres", "Tags"], sortBy: [ItemSortBy.SortName] }, { signal: abort.signal })
							.then((r) => allItems.push(...r.data.Items ?? []))
							.catch(onFailure);
				}

				onResolved(allItems);
			})
			.catch(onFailure);
	});
}

export const AudioService: BaseItemKindService = {
	kind: "Audio",
	findIcon: (props) => <MusicIcon {...props} />,
	listUrl: (library) => `/Music/Songs/${library.Id}`,
	loadList: (a, id) => LoadMusicInBatches(a, id),
	sortOptions: [
		SortByDateCreated,
	],
};
