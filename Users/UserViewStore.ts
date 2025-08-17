import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { getUserViewsApi } from "@jellyfin/sdk/lib/utils/api";

export class UserViewStore {
	constructor() {
		this._userViewsByUserId = {};
	}

	public LoadUserViewsWithAbort(userId: string): () => void {
		const userViewsForUser = this.FindOrCreateForUser(userId);

		if (userViewsForUser.HasData.Value) {
			return () => { };
		}

		userViewsForUser.Start((abort) => getUserViewsApi(ServerService.Instance.CurrentApi).getUserViews({ userId: userId }, { signal: abort.signal }).then((value) => value.data.Items ?? []));
		return () => userViewsForUser.ResetIfLoading();
	}

	public FindOrCreateForUser(userId: string): Receiver<BaseItemDto[]> {
		return this._userViewsByUserId[userId] ?? (this._userViewsByUserId[userId] = new Receiver(`UnknownError${this._iterator++}`));
	}

	private _iterator = 0;
	private _userViewsByUserId: Record<string, Receiver<BaseItemDto[]>>;

	static get Instance(): UserViewStore {
		return this._instance ?? (this._instance = new UserViewStore());
	}

	private static _instance: UserViewStore;
}
