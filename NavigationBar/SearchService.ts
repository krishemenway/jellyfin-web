import { BaseItemDto, BaseItemKind, ItemFields } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, FilteredObservable, Observable, RateLimiter, RateLimitType } from "@residualeffect/reactor";
import { EditableField } from "Common/EditableField";
import { Receiver } from "Common/Receiver";
import { getArtistsApi, getGenresApi, getItemsApi, getPersonsApi, getStudiosApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { ItemsApiGetItemsRequest } from "@jellyfin/sdk/lib/generated-client/api/items-api";

export class SearchResults {
	constructor(artists: BaseItemDto[], people: BaseItemDto[], restOfItems: BaseItemDto[], studios: BaseItemDto[]) {
		this.AllItems = artists.concat(people).concat(studios).concat(restOfItems).sort((a, b) => (b.UserData?.LastPlayedDate ?? "0001").localeCompare(a.UserData?.LastPlayedDate ?? "0001"));
		this.ItemsByType = this.GroupItemsByType(this.AllItems);
		this.AllTypes = Object.keys(this.ItemsByType).map((t) => t as BaseItemKind);

		this.SelectedType = new Observable(undefined);
		this.SelectedItems = new Computed(() => {
			const type = this.SelectedType.Value;
			
			if (type === undefined) {
				return this.AllItems;
			}

			return this.ItemsByType[type];
		});
	}

	private GroupItemsByType(items?: BaseItemDto[]): Record<BaseItemKind, BaseItemDto[]> {
		return (items ?? []).reduce((allByType, current) => {
			if (current.Type === undefined) {
				return allByType;
			}

			if (allByType[current.Type] === undefined) {
				allByType[current.Type] = [];
			}

			allByType[current.Type].push(current);
			return allByType;
		}, {} as Record<string, BaseItemDto[]>)
	}

	public AllItems: BaseItemDto[];
	public AllTypes: BaseItemKind[];
	public ItemsByType: Record<BaseItemKind, BaseItemDto[]>;

	public SelectedType: Observable<BaseItemKind|undefined>;
	public SelectedItems: Computed<BaseItemDto[]>;
}

export class SearchService {
	constructor() {
		this.SearchTermField = new EditableField("SearchQuery", "");
		this.ThrottledSearchTerm = new FilteredObservable("", RateLimiter(RateLimitType.Debounce, 300));

		this.SearchTermField.Current.Subscribe((newValue) => this.ThrottledSearchTerm.Value = newValue);
		this.ThrottledSearchTerm.Subscribe((searchTerm) => this.PerformSearch(searchTerm));

		this.ResultsVisible = new Computed(() => this.SearchTermField.Current.Value.length > 0);
		this.Results = new Receiver("UnknownError");
	}

	public PerformSearch(searchTerm: string): void {
		if (searchTerm.length <= 2) {
			return;
		}

		const request: ItemsApiGetItemsRequest = {
			userId: ServerService.Instance.CurrentUserId,
			enableTotalRecordCount: false,
			fields: [ ItemFields.PrimaryImageAspectRatio, ItemFields.CanDelete, ItemFields.MediaSourceCount ],
			limit: 100,
			imageTypeLimit: 1,
			searchTerm: searchTerm,
			recursive: true,
		};

		this.Results.Start((a) => Promise.all([
			getArtistsApi(ServerService.Instance.CurrentApi).getArtists(request, { signal: a.signal }).then((response) => response.data.Items ?? []),
			getPersonsApi(ServerService.Instance.CurrentApi).getPersons(request, { signal: a.signal }).then((response) => response.data.Items ?? []),
			getItemsApi(ServerService.Instance.CurrentApi).getItems(request, { signal: a.signal }).then((response) => response.data.Items ?? []),
			getStudiosApi(ServerService.Instance.CurrentApi).getStudios(request, { signal: a.signal }).then((response) => response.data.Items ?? []),
			getGenresApi(ServerService.Instance.CurrentApi).getGenres(request, { signal: a.signal }).then((response) => response.data.Items ?? []),
		]).then(([artists, people, itemsByType, studios]) => new SearchResults(artists, people, itemsByType, studios)));
	}

	public Clear(): void {
		this.SearchTermField.OnChange("");
		this.Results.Reset();
	}

	public SearchTermField: EditableField;
	public ThrottledSearchTerm: Observable<string>;

	public Results: Receiver<SearchResults>;
	public ResultsVisible: Computed<boolean>;

	static get Instance(): SearchService {
		return this._instance ?? (this._instance = new SearchService());
	}

	private static _instance: SearchService;
}
