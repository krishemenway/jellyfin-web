import { getLocalizationApi } from "@jellyfin/sdk/lib/utils/api";
import { LocalizationOption } from "@jellyfin/sdk/lib/generated-client/models";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class LocalizationOptionsStore {
	constructor() {
		this.LocalizationOptions = new Receiver("UnknownError");
		this.LocalizationOptions.OnReceived.push((lo) => window.localStorage.setItem("LocalizationOptions", JSON.stringify(lo)));
	}

	public Load(): void {
		if (!this.LocalizationOptions.HasData.Value) {
			const existingLocalizationOptions = window.localStorage.getItem("LocalizationOptions");

			if (Nullable.HasValue(existingLocalizationOptions)) {
				this.LocalizationOptions.Received(JSON.parse(existingLocalizationOptions));
			} else {
				this.LocalizationOptions.Start((a) => getLocalizationApi(ServerService.Instance.CurrentApi).getLocalizationOptions({ signal: a.signal }).then((r) => r.data));
			}
		}
	}

	public LocalizationOptions: Receiver<LocalizationOption[]>;

	static get Instance(): LocalizationOptionsStore {
		return this._instance ?? (this._instance = new LocalizationOptionsStore());
	}

	private static _instance: LocalizationOptionsStore;
}
