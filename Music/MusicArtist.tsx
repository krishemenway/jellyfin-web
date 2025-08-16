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

export const MusicArtist: React.FC = () => {
	const artistId = useParams().artistId;

	if (!Nullable.HasValue(artistId)) {
		return <PageWithNavigation icon="MusicArtist"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(artistId).LoadItemWithAbort(), [artistId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(artistId).LoadChildrenWithAbort(), [artistId]);

	return (
		<PageWithNavigation icon="MusicArtist">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(artistId).Item, ItemService.Instance.FindOrCreateItemData(artistId).Children]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(artist, children) => (
					<Layout direction="column">
						<PageTitle text={artist.Name} />
						{children.length}
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};
