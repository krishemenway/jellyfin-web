import { BaseItemDto, ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";

export class ItemListService {
	constructor(id: string) {
		this.Id = id;
		this.List = new Receiver("UnknownError");
	}

	public LoadWithAbort(): () => void {
		if (this.List.HasData.Value) {
			return () => { };
		}

		this.List.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: this.Id, fields: ["DateCreated", "Genres", "Tags"], sortBy: [ItemSortBy.SortName] }, { signal: a.signal }).then((response) => response.data.Items ?? []));
		return () => this.List.ResetIfLoading();
	}

	public Id: string;
	public List: Receiver<BaseItemDto[]>;
}
