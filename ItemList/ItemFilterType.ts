import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { FilterOperation } from "ItemList/FilterOperation";

export interface ItemFilterType {
	labelKey: string;
	targetField: (item: BaseItemDto) => string[]|number[]|string|number|boolean|undefined|null;
	operations: FilterOperation[];
}
