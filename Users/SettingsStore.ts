import { DisplayPreferencesDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getDisplayPreferencesApi } from "@jellyfin/sdk/lib/utils/api";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";

export class Settings {
	constructor(id: string, fromServer: DisplayPreferencesDto) {
		this.Id = id;
		this._fromServer = fromServer;
	}

	public ReadAsJson<T>(key: string): T|undefined {
		const value = this.Read(key);

		if (!Nullable.HasValue(value)) {
			return undefined;
		}

		return JSON.parse(value);
	}

	public Read(key: string): string|null {
		return Nullable.Value(this._fromServer.CustomPrefs, "", preferences => preferences[key]);
	}

	public AllKeys(): string[] {
		return Object.keys(this._fromServer.CustomPrefs ?? {});
	}

	public CreateSaveRequest<T>(key: string, value: T): DisplayPreferencesDto {
		return {
			Id: this.Id,
			...this._fromServer,
			CustomPrefs: {
				...this._fromServer.CustomPrefs,
				[key]: JSON.stringify(value),
			},
		};
	}

	public Id: string;
	private _fromServer: DisplayPreferencesDto;
}

export class SettingsStore {
	constructor() {
		this.Settings = new Receiver("UnknownError");
		this.SaveSettingsResult = new Receiver("UnknownError");
	}

	public LoadSettings(id?: string): () => void {
		if (id === undefined) {
			throw new Error("Cannot load settings for missing id");
		}

		this.Settings.Start((a) => getDisplayPreferencesApi(ServerService.Instance.CurrentApi).getDisplayPreferences({ client: "emby", userId: ServerService.Instance.CurrentUserId.Value, displayPreferencesId: id }, { signal: a.signal }).then((response) => {
			return new Settings(id, response.data);
		}));

		return () => this.Settings.ResetIfLoading();
	}

	public SaveSettings(settings: DisplayPreferencesDto): void {
		this.SaveSettingsResult.Start((abort) => getDisplayPreferencesApi(ServerService.Instance.CurrentApi).updateDisplayPreferences({ client: "emby", userId: ServerService.Instance.CurrentUserId.Value, displayPreferencesId: settings.Id!, displayPreferencesDto: settings }, { signal: abort.signal }).then((response) => response.status === 200));
	}

	public Settings: Receiver<Settings>;
	public SaveSettingsResult: Receiver<boolean>;

	static get Instance(): SettingsStore {
		return this._instance ?? (this._instance = new SettingsStore());
	}

	private static _instance: SettingsStore;
}
