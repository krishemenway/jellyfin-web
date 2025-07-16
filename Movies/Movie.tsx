import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import IconForItemType from "Items/IconForItemType";
import { useParams } from "react-router-dom";
import NotFound from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import LoadingSpinner from "Common/LoadingSpinner";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import Layout from "Common/Layout";

const Movie: React.FC = () => {
	const routeParams = useParams<{ movieId: string }>();

	if (routeParams.movieId === undefined) {
		return <NotFound />;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.movieId).LoadItemWithAbort(), [routeParams.movieId]);

	return (
		<PageWithNavigation icon={<IconForItemType itemType="Movie" size={24} />}>
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.movieId).Item]}
				whenNotStarted={<LoadingSpinner />}
				whenLoading={<LoadingSpinner />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(movie) => (
					<Layout direction="column">
						{movie.Name}
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};

export default Movie;
