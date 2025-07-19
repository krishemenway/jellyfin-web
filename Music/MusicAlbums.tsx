import * as React from "react";
import { Loading } from "Common/Loading";
import { ItemService } from "Items/ItemsService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { useParams } from "react-router-dom";
import { ItemsGrid } from "Items/ItemsGrid";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { NotFound } from "Common/NotFound";
import { IconForItemType } from "Items/IconForItemType";
import { ItemListFilters, ItemListService } from "Items/ItemListFilters";

export const MusicAlbums: React.FC = () => {
	const routeParams = useParams<{ libraryId: string }>();
	const itemListService = React.useMemo(() => new ItemListService(), [routeParams.libraryId]);

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.libraryId).LoadChildrenWithAbort(), [routeParams.libraryId]);

	if (routeParams.libraryId === undefined) {
		return <NotFound />;
	}

	return (
		<PageWithNavigation icon={<IconForItemType itemType="MusicAlbum" size={24} />}>
			<ItemListFilters service={itemListService} />
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.libraryId).Children]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon size={48} />}
				whenNotStarted={<LoadingIcon size={48} />}
				whenReceived={(items) => <ItemsGrid items={items} />}
			/>
		</PageWithNavigation>
	);
};
