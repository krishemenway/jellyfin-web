import * as React from "react";
import { Loading } from "Common/Loading";
import { ItemService } from "Items/ItemsService";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import LoadingSpinner from "Common/LoadingSpinner";
import { useParams } from "react-router-dom";
import ItemsGrid from "Items/ItemsGrid";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import NotFound from "Common/NotFound";
import IconForItemType from "Items/IconForItemType";
import ItemListFilters, { ItemListService } from "Items/ItemListFilters";

const Songs: React.FC = () => {
	const routeParams = useParams<{ libraryId: string }>();
	const itemListService = React.useMemo(() => new ItemListService(), [routeParams.libraryId]);

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.libraryId).LoadChildrenWithAbort(), [routeParams.libraryId]);

	if (routeParams.libraryId === undefined) {
		return <NotFound />;
	}

	return (
		<PageWithNavigation icon={<IconForItemType itemType="Audio" size={24} />}>
			<ItemListFilters service={itemListService} />
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.libraryId).Children]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
				whenReceived={(items) => <ItemsGrid items={items} />}
			/>
		</PageWithNavigation>
	);
};

export default Songs;
