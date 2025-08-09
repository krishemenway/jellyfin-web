import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { Computed, Observable } from "@residualeffect/reactor";
import { ServerService } from "Servers/ServerService";
import { Nullable } from "./MissingJavascriptFunctions";

export class BackdropService {
	constructor() {
		this.Current = new Observable(undefined);
		this.CurrentBackdropImageUrl = new Computed(() => this.FindBackdropImage());
	}

	public SetWithDispose(item: BaseItemDto): () => void {
		this.Current.Value = item;

		return () => {
			this.Current.Value = undefined;
		};
	}

	private FindBackdropImage(): string|undefined {
		return Nullable.ValueOrDefault(this.Current.Value, undefined, (c) => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrl(c, "Backdrop" ));
	}

	public Current: Observable<BaseItemDto|undefined>;
	public CurrentBackdropImageUrl: Computed<string|undefined>;

	static get Instance(): BackdropService {
		return this._instance ?? (this._instance = new BackdropService());
	}

	private static _instance: BackdropService;
}
