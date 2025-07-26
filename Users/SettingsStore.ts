import { getDisplayPreferencesApi } from "@jellyfin/sdk/lib/utils/api";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";

export class Settings {
	constructor(settingsFromServer: Record<string, string|null>) {
		this._settingsFromServer = settingsFromServer;
	}

	public ReadAsJson<T>(key: string, defaultValue: T): T {
		const value = this.Read(key);

		if (!Nullable.HasValue(value) || value === "") {
			return defaultValue;
		}

		return JSON.parse(value);
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

	public LoadSettings(id?: string): () => void {
		if (id === undefined) {
			throw new Error("Cannot load settings for missing id");
		}

		this.Settings.Start((a) => getDisplayPreferencesApi(ServerService.Instance.CurrentApi).getDisplayPreferences({ client: "emby", userId: ServerService.Instance.CurrentUserId, displayPreferencesId: id }, { signal: a.signal }).then((response) => {
			return new Settings(response.data.CustomPrefs ?? {});
		}));

		return () => this.Settings.AbortWhenLoading();
	}

	public Settings: Receiver<Settings>;

	static get Instance(): SettingsStore {
		return this._instance ?? (this._instance = new SettingsStore());
	}

	private static _instance: SettingsStore;
}
