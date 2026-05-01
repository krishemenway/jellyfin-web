import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { Computed, Observable } from "node_modules/@residualeffect/reactor/lib";
import { ItemListViewOptions, ItemViewOptionsData } from "ItemList/ItemListViewOptions";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { EditableField } from "Common/EditableField";

export class HomeViewOptions {
	constructor(settings: Settings) {
		this.Settings = settings;
		this.IsEditing = new Observable(false);
		this.ViewOptionsKeys = new EditableField("ViewOptionsForHome", settings.ReadAsJson<string[]>("ViewOptionHomeConfigurations") ?? []);
		this.ViewOptions = new Computed(() => this.LoadHomeOptions(settings));
		this.AllViewOptions = new Computed(() => this.Settings.AllKeys().filter((k) => k.startsWith(`ViewOption|`)).map((k) => this.LoadForKey(k, settings)));
	}

	public Save(): void {
		SettingsStore.Instance.SaveSettings("usersettings", this.Settings.CreateSaveRequestWithChangedKey("ViewOptionHomeConfigurations", this.ViewOptionsKeys.Current.Value), () => {
			SettingsStore.Instance.LoadSettings("usersettings", () => {
				this.ViewOptionsKeys.OnSaved();
				this.IsEditing.Value = false;
			});
		});
	}

	public LoadHomeOptions(settings: Settings): ItemListViewOptions[] {
		return this.ViewOptionsKeys.Current.Value.map((key) => this.LoadForKey(key, settings));
	}

	private LoadForKey(key: string, settings: Settings): ItemListViewOptions {
		const keyParts = key.split("|");
		const viewOptionsData = settings.ReadAsJsonOrThrow<ItemViewOptionsData>(key);
		return new ItemListViewOptions(BaseItemKindServiceFactory.FindOrThrow(viewOptionsData?.Kind), keyParts[1], keyParts[2], viewOptionsData);
	}

	public Settings: Settings;
	public IsEditing: Observable<boolean>;
	public ViewOptionsKeys: EditableField<string[]>;
	public ViewOptions: Computed<ItemListViewOptions[]>;
	public AllViewOptions: Computed<ItemListViewOptions[]>;
}
