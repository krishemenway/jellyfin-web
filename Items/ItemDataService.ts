import { ItemsApiGetItemsRequest } from "@jellyfin/sdk/lib/generated-client/api/items-api";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi, getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { SortByObjects, SortFuncs } from "Common/Sort";
import { ServerService } from "Servers/ServerService";

export class ItemDataService {
	constructor(id: string) {
		this.Id = id;

		this.Item = new Receiver("UnknownError");
		this.Children = new Receiver("UnknownError");
		this.RelatedPeople = new Receiver("UnknownError");
	}

	public LoadItemWithAbort(): () => void {
		if (this.Item.HasData.Value) {
			return () => { };
		}

		this.Item.Start((a) => getUserLibraryApi(ServerService.Instance.CurrentApi).getItem({ itemId: this.Id, userId: ServerService.Instance.CurrentUserId }, { signal: a.signal }).then(response => response.data));
		return () => this.Item.ResetIfLoading();
	}

	public LoadChildrenWithAbort(withParentId?: boolean, request?: Partial<ItemsApiGetItemsRequest>, sortFuncs?: SortFuncs<BaseItemDto>[]): () => void {
		if (this.Children.HasData.Value) {
			return () => { };
		}

		const baseRequest: Partial<ItemsApiGetItemsRequest> = { enableUserData: true,
			userId: ServerService.Instance.CurrentUserId,
			parentId: withParentId !== false ? this.Id : undefined,
			fields: ["Overview", "Tags", "ExternalUrls", "Genres", "Studios", "People", "ProductionLocations", "MediaSourceCount"],
			sortBy: ["PremiereDate"],
			sortOrder: ["Ascending"],
		};

		this.Children.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ ...baseRequest, ...request }, { signal: a.signal }).then((response) => SortByObjects(response.data.Items ?? [], sortFuncs ?? [])), true);
		return () => this.Children.ResetIfLoading();
	}

	public Id: string;
	public Item: Receiver<BaseItemDto>;
	public Children: Receiver<BaseItemDto[]>;
	public RelatedPeople: Receiver<BaseItemDto[]>;
}
