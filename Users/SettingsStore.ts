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

	public ReadAsJsonOrThrow<T>(key: string): T {
		const value = this.ReadAsJson<T>(key);

		if (!Nullable.HasValue(value)) {
			throw new Error(`Expected key ${key} but was missing`);
		}

		return value;
	}

	public Read(key: string): string|null {
		return Nullable.Value(this._fromServer.CustomPrefs, "", preferences => preferences[key]);
	}

	public AllKeys(): string[] {
		return Object.keys(this._fromServer.CustomPrefs ?? {});
	}

	public CreateSaveRequestWithChangedKey<T>(key: string, value: T): DisplayPreferencesDto {
		return {
			Id: this.Id,
			...this._fromServer,
			CustomPrefs: {
				...this._fromServer.CustomPrefs,
				[key]: JSON.stringify(value),
			},
		};
	}

	public CreateSaveRequestWithRemovedKey(key: string): DisplayPreferencesDto {
		const result = {
			Id: this.Id,
			...this._fromServer,
			CustomPrefs: {
				...this._fromServer.CustomPrefs,
			},
		};

		delete result.CustomPrefs[key];
		return result;
	}

	public Id: string;
	private _fromServer: DisplayPreferencesDto;
}

export class SettingsStore {
	constructor() {
		this.SettingsById = {};
		this.SaveSettingsResult = new Receiver("UnknownError");
	}

	public ReceiverFor(id: string): Receiver<Settings> {
		return this.SettingsById[id] ?? (this.SettingsById[id] = new Receiver<Settings>("UnknownError"));
	}

	public LoadSettings(id?: string, onLoaded?: (settings: Settings) => void): () => void {
		if (id === undefined) {
			throw new Error("Cannot load settings for missing id");
		}

		this.ReceiverFor(id).Start((a) => getDisplayPreferencesApi(ServerService.Instance.CurrentApi).getDisplayPreferences({ client: "emby", userId: ServerService.Instance.CurrentUserId.Value, displayPreferencesId: id }, { signal: a.signal }).then((response) => {
			const settings = new Settings(id, response.data);
			Nullable.TryExecute(onLoaded, (f) => f(settings));
			return settings;
		}), true);

		return () => this.ReceiverFor(id).ResetIfLoading();
	}

	public SaveSettings(id: string, settings: DisplayPreferencesDto, onSuccess: () => void): void {
		const request = {
			client: "emby",
			userId: ServerService.Instance.CurrentUserId.Value,
			displayPreferencesId: id,
			displayPreferencesDto: settings
		};

		this.SaveSettingsResult.Start((abort) => getDisplayPreferencesApi(ServerService.Instance.CurrentApi).updateDisplayPreferences(request, { signal: abort.signal }).then((response) => { onSuccess(); return response.status === 200; }));
	}

	public SettingsById: Record<string, Receiver<Settings>>;
	public SaveSettingsResult: Receiver<boolean>;

	static get Instance(): SettingsStore {
		return this._instance ?? (this._instance = new SettingsStore());
	}

	private static _instance: SettingsStore;
}
