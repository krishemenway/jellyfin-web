import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { NotFound } from "Common/NotFound";

export const PhotoAlbum: React.FC = () => {
	const routeParams = useParams<{ albumId: string }>();

	if (routeParams.albumId === undefined) {
		return <PageWithNavigation icon="PhotoAlbum"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.albumId).LoadItemWithAbort(), [routeParams.albumId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.albumId).LoadChildrenWithAbort(), [routeParams.albumId]);

	return (
		<PageWithNavigation icon="PhotoAlbum">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.albumId).Item, ItemService.Instance.FindOrCreateItemData(routeParams.albumId).Children]}
				whenNotStarted={<LoadingIcon size={48} />}
				whenLoading={<LoadingIcon size={48} />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(album, children) => (
					<Layout direction="column">
						{album.Name} {children.length}
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};
