import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed } from "@residualeffect/reactor";
import { TranslationRequest } from "Common/TranslatedText";
import { IEditableField } from "Common/EditableField";
import { ItemFilterData } from "ItemList/ItemFilterTypeStore";

export interface ItemFilterType {
	FilterType: string;
	Label: string;
	CreateModel: (data?: ItemFilterData) => IFilterModel;
}

export interface FilterDisplayConfig {
	Field: TranslationRequest;
	Operation: TranslationRequest;
}

export interface IFilterModel {
	Key: string;
	FilterType: ItemFilterType;
	Editor(items: BaseItemDto[]): React.ReactNode;
	CreateRequest(): ItemFilterData;
	Display: Computed<FilterDisplayConfig|undefined>;
	Filter: Computed<(item: BaseItemDto) => boolean>;
	AllFields: Computed<IEditableField[]>;
}
