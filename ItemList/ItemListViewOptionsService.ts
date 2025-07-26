import { ItemListViewOptions, ItemViewOptionsData } from "ItemList/ItemListViewOptions";
import { Observable } from "@residualeffect/reactor";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { EditableItemFilter } from "ItemList/EditableItemFilter";
import { Settings } from "Users/SettingsStore";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { BaseItemKindService } from "Items/BaseItemKindService";

export class ItemListViewOptionsService {
	constructor(id: string, settings: Settings|null, itemKindService: BaseItemKindService|null) {
		this.Id = id;
		this.ItemKindService = itemKindService;
		this.Settings = settings;
		this.ViewOptions = new Observable(this.LoadItemListViewOptionsOrNew());
	}

	public CreateNewFilter(filterOption: ItemFilterType): void {
		const filter = this.ViewOptions.Value;
		filter.NewFilter.Value = new EditableItemFilter(filterOption);
	}

	private LoadItemListViewOptionsOrNew(): ItemListViewOptions {
		const mostRecent = this.Settings?.Read(`MostRecentOption-${this.Id}`) ?? "Default";
		const allViewOptions = this.Settings?.ReadAsJson<ItemViewOptionsData[]>(`AllViewOptions-${this.Id}`, []) ?? [];
		const mostRecentOption = allViewOptions.find(x => x.Label === mostRecent);

		if (!Nullable.HasValue(mostRecent) || !Nullable.HasValue(mostRecentOption)) {
			return new ItemListViewOptions("New", this.ItemKindService?.filterOptions ?? []);
		}

		return new ItemListViewOptions(mostRecentOption.Label, this.ItemKindService?.filterOptions ?? [], mostRecentOption);
	}

	public Id: string;
	public ItemKindService: BaseItemKindService|null;
	public ViewOptions: Observable<ItemListViewOptions>;

	private Settings: Settings|null;
}
