import * as React from "react";
import { Loading } from "Common/Loading";
import { ItemService } from "Items/ItemsService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { useParams } from "react-router-dom";
import { ItemsGrid } from "ItemList/ItemsGrid";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { NotFound } from "Common/NotFound";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";

export const PhotoAlbums: React.FC = () => {
	const routeParams = useParams<{ libraryId: string }>();
	const service = ItemService.Instance.FindOrCreateItemList(routeParams.libraryId);

	React.useEffect(() => service.LoadWithAbort(), [routeParams.libraryId]);

	if (routeParams.libraryId === undefined) {
		return <NotFound />;
	}

	return (
		<PageWithNavigation itemKind={BaseItemKind.PhotoAlbum}>
			<ItemListFilters itemKind={BaseItemKind.PhotoAlbum} itemId={routeParams.libraryId} service={service} />
			<Loading
				receivers={[service.List]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon size={48} />}
				whenNotStarted={<LoadingIcon size={48} />}
				whenReceived={() => <ItemsGrid service={service} />}
			/>
		</PageWithNavigation>
	);
};
