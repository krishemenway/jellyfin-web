import { getDisplayPreferencesApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";

export class Settings {
	constructor(settingsFromServer: Record<string, string|null>) {
		this._settingsFromServer = settingsFromServer;
	}

	public ReadAsJson<T>(key: string): T {
		return JSON.parse(this.Read(key));
	}

	public Read(key: string): string {
		return this._settingsFromServer[key] ?? "";
	}

	private _settingsFromServer: Record<string, string|null>;
}

export class SettingsStore {
	constructor() {
		this.Settings = new Receiver("UnknownError");
	}

	public LoadSettings(): void {
		this.Settings.Start((a) => getDisplayPreferencesApi(ServerService.Instance.CurrentApi).getDisplayPreferences({ client: "emby", userId: ServerService.Instance.CurrentUserId, displayPreferencesId: "" }, { signal: a.signal }).then((response) => {
			return new Settings(response.data.CustomPrefs ?? {});
		}));
	}

	public Settings: Receiver<Settings>;

	static get Instance(): SettingsStore {
		return this._instance ?? (this._instance = new SettingsStore());
	}

	private static _instance: SettingsStore;
}
