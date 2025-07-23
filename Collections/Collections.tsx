import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { useParams } from "react-router-dom";
import { ItemService } from "Items/ItemsService";
import { NotFound } from "Common/NotFound";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { ItemsGrid } from "ItemList/ItemsGrid";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";

export const Collections: React.FC = () => {
	const routeParams = useParams<{ collectionsId: string }>();
	const itemKind = BaseItemKind.BoxSet;
	const service = ItemService.Instance.FindOrCreateItemList(routeParams.collectionsId);

	React.useEffect(() => service.LoadWithAbort(), [routeParams.collectionsId]);

	if (routeParams.collectionsId === undefined) {
		return <NotFound />;
	}

	return (
		<PageWithNavigation itemKind={itemKind}>
			<ItemListFilters itemKind={itemKind} itemId={routeParams.collectionsId} service={service} />
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
