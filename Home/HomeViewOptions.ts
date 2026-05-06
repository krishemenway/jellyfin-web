import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { Computed, Observable } from "node_modules/@residualeffect/reactor/lib";
import { ItemListViewOptions, ItemViewOptionsData } from "ItemList/ItemListViewOptions";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { EditableField } from "Common/EditableField";
import { BaseItemDto } from "node_modules/@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class HomeViewOptions {
	constructor(settings: Settings, libraries: BaseItemDto[]) {
		this.Settings = settings;
		this.IsEditing = new Observable(false);
		this.ViewOptionsKeys = new EditableField("ViewOptionsForHome", settings.ReadAsJson<string[]>("ViewOptionHomeConfigurations") ?? []);
		this.AllViewOptions = new Computed(() => this.Settings.AllKeys().filter((k) => k.startsWith(`ViewOption|`)).map((k) => this.LoadForKey(k, settings)).concat(this.CreateAllBuiltInOptions(libraries)));
		this.ViewOptions = new Computed(() => this.LoadHomeOptions());
	}

	public Remove(keyIndex: number): void {
		this.ViewOptionsKeys.OnChange(this.ViewOptionsKeys.Current.Value.filter((o, i) => keyIndex !== i));
	}

	public Swap(keyIndexA: number, keyIndexB: number) {
		const set = this.ViewOptionsKeys.Current.Value;

		const valueA = this.ViewOptionsKeys.Current.Value[keyIndexA];
		const valueB = this.ViewOptionsKeys.Current.Value[keyIndexB];

		set[keyIndexA] = valueB;
		set[keyIndexB] = valueA;

		this.ViewOptionsKeys.OnChange(set);
	}

	public Save(): void {
		SettingsStore.Instance.SaveSettings("usersettings", this.Settings.CreateSaveRequestWithChangedKey("ViewOptionHomeConfigurations", this.ViewOptionsKeys.Current.Value), () => {
			SettingsStore.Instance.LoadSettings("usersettings", () => {
				this.ViewOptionsKeys.OnSaved();
				this.IsEditing.Value = false;
			});
		});
	}

	private CreateAllBuiltInOptions(libraries: BaseItemDto[]): ItemListViewOptions[] {
		return libraries.reduce((all, library) => {
			const serviceForLibrary = BaseItemKindServiceFactory.FindOrThrowByCollectionType(library.CollectionType)!;
			all.push(ItemListViewOptions.CreateRecentlyAdded(serviceForLibrary, library.Id!));
			return all;
		}, [] as ItemListViewOptions[]);
	}

	public LoadHomeOptions(): ItemListViewOptions[] {
		const allOptions = this.AllViewOptions.Value;
		return this.ViewOptionsKeys.Current.Value.map((key) => allOptions.find((o) => o.BuildStorageKey() === key)).filter((o) => Nullable.HasValue(o));
	}

	private LoadForKey(key: string, settings: Settings): ItemListViewOptions {
		const keyParts = key.split("|");
		const viewOptionsData = settings.ReadAsJson<ItemViewOptionsData>(key);

		if (!Nullable.HasValue(viewOptionsData)) {
			throw new Error(`Unable to find ${key}`);
		}

		return new ItemListViewOptions(BaseItemKindServiceFactory.FindOrThrow(viewOptionsData?.Kind), keyParts[1], keyParts[2], viewOptionsData);
	}

	public Settings: Settings;
	public IsEditing: Observable<boolean>;
	public ViewOptionsKeys: EditableField<string[]>;
	public ViewOptions: Computed<ItemListViewOptions[]>;
	public AllViewOptions: Computed<ItemListViewOptions[]>;
}
