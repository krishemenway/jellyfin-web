import { ObservableArray } from "@residualeffect/reactor";
import { ItemFilter } from "Items/ItemFilter";

export class HomeService {
	constructor() {
		this.ConfiguredItemFilters = new ObservableArray(this.FindConfiguredSectionsFromStorage());
	}

	private FindConfiguredSectionsFromStorage(): ItemFilter[] {
		// TODO read from window.localStorage
		return [];
	}

	public ConfiguredItemFilters: ObservableArray<ItemFilter>;

	static get Instance(): HomeService {
		return this._instance ?? (this._instance = new HomeService());
	}

	private static _instance: HomeService;
}
