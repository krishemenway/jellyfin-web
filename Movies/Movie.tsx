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
import { useBackgroundStyles } from "AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { ItemOverview } from "Items/ItemOverview";
import { TranslatedText } from "Common/TranslatedText";
import { LoginService } from "Users/LoginService";
import { ItemTags } from "Items/ItemTags";
import { PageTitle } from "Common/PageTitle";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { RefreshItemAction } from "MenuActions/RefreshItemAction";
import { CastAndCrew } from "Items/CastAndCrew";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { BackdropService } from "Common/BackdropService";

export const Movie: React.FC = () => {
	const movieId = useParams<{ movieId: string }>().movieId;

	if (!Nullable.HasValue(movieId)) {
		return <PageWithNavigation icon="Movie"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(movieId).LoadItemWithAbort(), [movieId]);

	return (
		<PageWithNavigation icon="Movie">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(movieId).Item, LoginService.Instance.User]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(movie, user) => <LoadedMovie movie={movie} user={user} />}
			/>
		</PageWithNavigation>
	);
};

function LoadedMovie({ user, movie }: { user: UserDto, movie: BaseItemDto }): JSX.Element {
	const background = useBackgroundStyles();

	React.useEffect(() => BackdropService.Instance.SetWithDispose(movie), [movie]);

	return (
		<Layout direction="row" gap="1em" py="1em">
			<Layout direction="column" maxWidth="20%" gap=".5em">
				<Layout direction="column" gap=".5em">
					<Layout direction="column" position="relative">
						<ItemImage item={movie} type="Primary" />
						<ItemRating item={movie} position="absolute" bottom=".5em" right=".5em" />
					</Layout>

					<ItemExternalLinks
						item={movie}
						direction="row" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
					/>

					<ItemGenres
						item={movie}
						direction="row" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={4}
					/>

					<ItemStudios
						item={movie}
						direction="column" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={3}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2em">
				<Layout direction="row" justifyContent="space-between">
					<PageTitle text={movie.Name} />
					<ItemActionsMenu items={[movie]} actions={[
						[ // User-based actions
							AddToFavoritesAction,
							MarkPlayedAction,
							AddToCollectionAction,
							AddToPlaylistAction,
						],
						[ // Server-based actions
							EditItemAction,
							RefreshItemAction,
						]
					]} user={user} />
				</Layout>

				<ItemOverview item={movie} />

				{(movie.Tags?.length ?? 0) > 0 && (
					<Layout direction="row" gap=".5em">
						<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: ".25em", py: ".25em" }} />
						<ItemTags
							item={movie}
							direction="row" gap=".5em" wrap
							linkClassName={background.button}
							linkLayout={{ px: ".25em", py: ".25em" }}
							showMoreLimit={25}
						/>
					</Layout>
				)}

				{(movie.People?.length ?? 0) > 0 && (
					<Layout direction="column" minWidth="100%">
						<Layout direction="row" fontSize="1.5em" py=".5em" px=".5em" className={background.panel}><TranslatedText textKey="HeaderCastAndCrew" /></Layout>

						<CastAndCrew
							itemWithPeople={movie}
							className={background.panel}
							direction="row" wrap px=".5em" py="1em"
							linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
						/>
					</Layout>
				)}
			</Layout>
		</Layout>
	)
}