import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";

export class ItemDataService {
	constructor(id: string) {
		this.Id = id;

		this.Item = new Receiver("UnknownError");
		this.Children = new Receiver("UnknownError");
		this.RelatedPeople = new Receiver("UnknownError");
	}

	public LoadItemWithAbort(): () => void {
		this.Item.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ ids: [this.Id], fields: ["Overview", "Tags", "ExternalUrls", "Genres", "Studios", "People"] }, { signal: a.signal }).then((response) => (response.data.Items ?? [])[0] ));
		return () => this.Item.AbortWhenLoading();
	}

	public LoadChildrenWithAbort(): () => void {
		this.Children.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: this.Id }, { signal: a.signal }).then((response) => response.data.Items ?? []));
		return () => this.Children.AbortWhenLoading();
	}

	public Id: string;
	public Item: Receiver<BaseItemDto>;
	public Children: Receiver<BaseItemDto[]>;
	public RelatedPeople: Receiver<BaseItemDto[]>;
}
