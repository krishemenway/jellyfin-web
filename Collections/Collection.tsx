import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import IconForItemType from "Items/IconForItemType";

const Collection: React.FC = () => {
	return (
		<PageWithNavigation icon={<IconForItemType itemType="AggregateFolder" size={24} />}>
			Collection
		</PageWithNavigation>
	);
};

export default Collection;
