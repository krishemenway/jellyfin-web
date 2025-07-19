import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { IconForItemType } from "Items/IconForItemType";
import { ItemListFilters, ItemListService } from "Items/ItemListFilters";

export const Collections: React.FC = () => {
	const itemListService = React.useMemo(() => new ItemListService(), []);

	return (
		<PageWithNavigation icon={<IconForItemType itemType="AggregateFolder" size={24} />}>
			<ItemListFilters service={itemListService} />
		</PageWithNavigation>
	);
};
