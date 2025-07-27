import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
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

	}

	public Id: string;
	public List: Receiver<BaseItemDto[]>;
}
