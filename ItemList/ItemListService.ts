import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { ItemFilter } from "ItemList/ItemFilter";
import { Computed, Observable } from "@residualeffect/reactor";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemFilterValue } from "ItemList/ItemFilterValue";

export class ItemListService {
	constructor(id: string) {
		this.Id = id;
		this.List = new Receiver("UnknownError");
		this.Filter = new Observable(new ItemFilter(id, id));

		this.FilteredAndSortedItems = new Computed(() => {
			const currentFilterState = this.Filter.Value;
			const filterFunc = currentFilterState.FilterFunc.Value;
			const sortFunc = currentFilterState.SortByFunc.Value;

			return (this.List.Data.Value.ReceivedData ?? []).filter(filterFunc).sort(sortFunc);
		});
	}

	public CreateNewFilter(filterOption: ItemFilterType): void {
		const filter = this.Filter.Value;
		filter.NewFilter.Value = new ItemFilterValue(filterOption);
	}

	public LoadWithAbort(): () => void {
		this.List.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: this.Id, fields: ["DateCreated"] }, { signal: a.signal }).then((response) => response.data.Items ?? []));
		return () => this.List.AbortWhenLoading();
	}

	public Id: string;
	public List: Receiver<BaseItemDto[]>;
	public Filter: Observable<ItemFilter>;
	public FilteredAndSortedItems: Computed<BaseItemDto[]>;
}
