import { BaseItemDto, QueryFiltersLegacy } from "@jellyfin/sdk/lib/generated-client/models";
import { FilterOperation } from "ItemList/FilterOperation";
import { EditableItemFilter } from "ItemList/EditableItemFilter";

export interface ItemFilterTypeProps {
	filter: EditableItemFilter;
	filters: QueryFiltersLegacy;
	currentOperation: FilterOperation;
	libraryId: string;
}

export interface ItemFilterType {
	type: string;
	labelKey: string;
	targetField: (item: BaseItemDto) => string[]|number[]|string|number|boolean|undefined|null;
	operations: FilterOperation[];
	editor: React.FC<ItemFilterTypeProps>;
}
