import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { NotFound } from "Common/NotFound";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { PageTitle } from "Common/PageTitle";

export const PhotoAlbum: React.FC = () => {
	const albumId = useParams().albumId;

	if (!Nullable.HasValue(albumId)) {
		return <PageWithNavigation icon="PhotoAlbum"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(albumId).LoadItemWithAbort(), [albumId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(albumId).LoadChildrenWithAbort(), [albumId]);

	return (
		<PageWithNavigation icon="PhotoAlbum">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(albumId).Item, ItemService.Instance.FindOrCreateItemData(albumId).Children]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(album, children) => (
					<Layout direction="column">
						<PageTitle text={album.Name} />
						{album.Name} {children.length}
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};
