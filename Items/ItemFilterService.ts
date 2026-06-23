import { QueryFiltersLegacy } from "@jellyfin/sdk/lib/generated-client/models";
import { getFilterApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { SortByNumber, SortByString } from "Common/Sort";
import { ServerService } from "Servers/ServerService";

export class ItemFilterService {
	constructor() {
		this._filtersByLibraryId = {};
	}

	public LoadFiltersWithAbort(libraryIds: string[]): () => void {
		const receiver = this.FindOrCreateFiltersReceiver(libraryIds);

		if (!receiver.HasData.Value) {
			receiver.Start((a) => Promise.all(libraryIds.map((libraryId) => this.LoadFiltersForLibraryId(libraryId, a))).then((filters) => filters.reduce((previous, current) => this.Merge(previous, current), {})).then((results) => {
				results.Genres = (results.Genres ?? []).sort(SortByString((x => x))).distinct();
				results.Tags = (results.Tags ?? []).sort(SortByString((x => x))).distinct();
				results.OfficialRatings = (results.OfficialRatings ?? []).sort(SortByString((x => x))).distinct();
				results.Years = (results.Years ?? []).sort(SortByNumber((x => x))).distinct();

				return results;
			}));
		}

		return () => receiver.ResetIfLoading();
	}

	public FindOrCreateFiltersReceiver(libraryIds: string[]): Receiver<QueryFiltersLegacy> {
		const id = libraryIds.join(",");
		return this._filtersByLibraryId[id] ?? (this._filtersByLibraryId[id] = new Receiver<QueryFiltersLegacy>(id));
	}

	private LoadFiltersForLibraryId(libraryId: string, abort: AbortController): Promise<QueryFiltersLegacy> {
		return getFilterApi(ServerService.Instance.CurrentApi).getQueryFiltersLegacy({ parentId: libraryId }, { signal: abort.signal }).then((data) => data.data);
	}

	private Merge(a: QueryFiltersLegacy, b: QueryFiltersLegacy): QueryFiltersLegacy {
		return {
			Genres: (a.Genres ?? []).concat(b.Genres ?? []),
			Tags: (a.Tags ?? []).concat(b.Tags ?? []),
			OfficialRatings: (a.OfficialRatings ?? []).concat(b.OfficialRatings ?? []),
			Years : (a.Years ?? []).concat(b.Years ?? []),
		};
	}

	private _filtersByLibraryId: Record<string, Receiver<QueryFiltersLegacy>>;

	static get Instance(): ItemFilterService {
		return this._instance ?? (this._instance = new ItemFilterService());
	}

	private static _instance: ItemFilterService;
}
