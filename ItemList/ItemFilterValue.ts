import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable } from "@residualeffect/reactor";
import { FilterOperation } from "ItemList/FilterOperation";
import { ItemFilterType } from "ItemList/ItemFilterType";

export class ItemFilterValue {
	constructor(filterType: ItemFilterType) {
		this.FilterType = filterType;

		this.Operation = new Observable(filterType.operations[0]);
		this.FilterValue = new Observable("");
	}

	public IsFiltered(item: BaseItemDto): boolean {
		const valueForItem = this.FilterType.targetField(item);
		const filterValue = this.FilterValue.Value;

		return this.Operation.Value.Operation(valueForItem, filterValue);
	}

	public FilterType: ItemFilterType;
	public Operation: Observable<FilterOperation>;
	public FilterValue: Observable<string|number>;
}
