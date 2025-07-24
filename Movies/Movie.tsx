import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { NotFound } from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout } from "Common/Layout";
import { ItemImage } from "Items/ItemImage";
import { ItemRating } from "Items/ItemRating";
import { ItemStudios } from "Items/ItemStudios";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { useBackgroundStyles } from "Common/AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemActionsMenu } from "Items/ItemActionsMenu";

export const Movie: React.FC = () => {
	const routeParams = useParams<{ movieId: string }>();
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(routeParams.movieId)) {
		return <PageWithNavigation itemKind="Movie"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.movieId).LoadItemWithAbort(), [routeParams.movieId]);

	return (
		<PageWithNavigation itemKind="Movie">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.movieId).Item]}
				whenNotStarted={<LoadingIcon size={48} />}
				whenLoading={<LoadingIcon size={48} />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(movie) => (
					<Layout direction="row" gap={16} py={16}>
						<Layout direction="column" maxWidth="20%" gap={8}>
							<Layout direction="column" gap={8}>
								<Layout direction="column" position="relative">
									<ItemImage item={movie} type="Primary" />
									<ItemRating item={movie} position="absolute" bottom={8} right={8} />
								</Layout>

								<ItemExternalLinks
									item={movie}
									direction="row" gap={8}
									linkClassName={background.button}
									linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center", grow: 1}}
								/>

								<ItemGenres
									item={movie}
									direction="row" gap={8}
									linkClassName={background.button}
									linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center", grow: 1}}
								/>

								<ItemStudios
									item={movie}
									direction="column" gap={8}
									linkClassName={background.button}
									linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center", grow: 1 }}
								/>
							</Layout>
						</Layout>
						<Layout direction="column" grow={1} gap={32}>
							<Layout direction="row" fontSize="32px" justifyContent="space-between">
								<Layout direction="row" className="show-name">{movie.Name}</Layout>
								<ItemActionsMenu actions={[]} />
							</Layout>
							{Nullable.HasValue(movie.Overview) && <Layout direction="row" fontSize="12px" className="movie-overview">{movie.Overview}</Layout>}
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};
