import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { NotFound } from "Common/NotFound";
import { IconForItemType } from "Items/IconForItemType";

export const MusicArtist: React.FC = () => {
	const routeParams = useParams<{ artistId: string }>();

	if (routeParams.artistId === undefined) {
		return <NotFound />;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.artistId).LoadItemWithAbort(), [routeParams.artistId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.artistId).LoadChildrenWithAbort(), [routeParams.artistId]);

	return (
		<PageWithNavigation icon={<IconForItemType itemType="MusicArtist" size={24} />}>
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.artistId).Item, ItemService.Instance.FindOrCreateItemData(routeParams.artistId).Children]}
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
