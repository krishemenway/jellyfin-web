import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi, getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api";
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
		if (this.Item.HasData.Value) {
			return () => { };
		}

		this.Item.Start((a) => getUserLibraryApi(ServerService.Instance.CurrentApi).getItem({ itemId: this.Id, userId: ServerService.Instance.CurrentUserId }, { signal: a.signal }).then(response => response.data));
		return () => this.Item.ResetIfLoading();
	}

	public LoadChildrenWithAbort(): () => void {
		if (this.Children.HasData.Value) {
			return () => { };
		}

		this.Children.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: this.Id, recursive: true, fields: ["Overview", "Tags", "ExternalUrls", "Genres", "Studios", "People", "ProductionLocations"] }, { signal: a.signal }).then((response) => response.data.Items ?? []), true);
		return () => this.Children.ResetIfLoading();
	}

	public Id: string;
	public Item: Receiver<BaseItemDto>;
	public Children: Receiver<BaseItemDto[]>;
	public RelatedPeople: Receiver<BaseItemDto[]>;
}
