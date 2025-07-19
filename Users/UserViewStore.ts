import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { getUserViewsApi } from "@jellyfin/sdk/lib/utils/api";

export class UserViewStore {
	constructor() {
		this.UserViews = new Receiver("UnknownError");
	}

	public LoadUserViews(): void {
		this.UserViews.Start((abort) => getUserViewsApi(ServerService.Instance.CurrentApi).getUserViews({ userId: ServerService.Instance.CurrentUserId }, { signal: abort.signal }).then((value) => value.data.Items ?? []))
	}

	public UserViews: Receiver<BaseItemDto[]>;

	static get Instance(): UserViewStore {
		return this._instance ?? (this._instance = new UserViewStore());
	}

	private static _instance: UserViewStore;
}
