import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { TranslationRequest } from "Common/TranslatedText";

export interface ItemGroupByType {
	GroupByType: string;
	TypeLabel: TranslationRequest;
	FindKey: (item: BaseItemDto) => string | string[] | number | number[];
}
