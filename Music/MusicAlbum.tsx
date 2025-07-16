import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import Layout from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import LoadingSpinner from "Common/LoadingSpinner";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import NotFound from "Common/NotFound";
import IconForItemType from "Items/IconForItemType";

const MusicAlbum: React.FC = () => {
	const routeParams = useParams<{ albumId: string; songId?: string; }>();

	if (routeParams.albumId === undefined) {
		return <NotFound />;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.albumId).LoadItemWithAbort(), [routeParams.albumId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.albumId).LoadChildrenWithAbort(), [routeParams.albumId]);

	return (
		<PageWithNavigation icon={<IconForItemType itemType="MusicAlbum" size={24} />}>
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.albumId).Item, ItemService.Instance.FindOrCreateItemData(routeParams.albumId).Children]}
				whenNotStarted={<LoadingSpinner />}
				whenLoading={<LoadingSpinner />}
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

export default MusicAlbum;
