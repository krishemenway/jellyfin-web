import * as React from "react";
import { Layout } from "Common/Layout";
import { TranslatedText } from "Common/TranslatedText";
import { ObservableArray } from "@residualeffect/reactor";
import { ItemFilter } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";

export class ItemListService {
	constructor() {
		this.Filters = new ObservableArray([]);
	}

	public Filters: ObservableArray<ItemFilter>;
}

export const ItemListFilters: React.FC<{ service: ItemListService }> = (props) => {
	const filters = useObservable(props.service.Filters);

	return (
		<Layout direction="row">
			<TranslatedText textKey="Filters" />
			{filters.length}
		</Layout>
	);
};
