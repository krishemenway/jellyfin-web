import * as React from "react";
import { PageWithNavigation, PageIsLoading } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { NotFound } from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
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
import { LoginService } from "Users/LoginService";
import { ItemTags } from "Items/ItemTags";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { CastAndCrew } from "Items/CastAndCrew";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { BackdropService } from "Common/BackdropService";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { Button } from "Common/Button";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { useObservable } from "@residualeffect/rereactor";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { ItemPremiereDate } from "Items/ItemPremiereDate";
import { ItemDuration } from "Items/ItemDuration";
import { ChangeImageButton } from "Items/ChangeImageButton";
import { ItemMediaInfo } from "Items/ItemMediaInfo";

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
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(movie, user) => <LoadedMovie movie={movie} user={user} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedMovie: React.FC<{ user: UserDto, movie: BaseItemDto }> = ({ user, movie }) => {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(movie, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(movie), [movie]);

	return (
		<Layout direction="row" gap="1em" py="1rem">
			<Layout direction="column" maxWidth="20%" gap=".5rem">
				<Layout direction="column" gap=".5rem">
					<Layout direction="column">
						<Layout direction="column" position="relative">
							<ItemImage item={movie} type="Primary" />
							<ItemRating item={movie} position="absolute" bottom=".5em" right=".5em" libraryId={movie.ParentId!} isEditing={isEditing} editableItem={editableItem} />
						</Layout>
	
						<ChangeImageButton item={movie} imageType="Primary" label="ButtonChangeImage" onChanged={() => ItemService.Instance.FindOrCreateItemData(movie.Id!).LoadItemWithAbort(true)} isEditing={isEditing} />
						<ChangeImageButton item={movie} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => ItemService.Instance.FindOrCreateItemData(movie.Id!).LoadItemWithAbort(true)} isEditing={isEditing} />
					</Layout>

					<ItemExternalLinks
						item={movie}
						direction="row" gap=".5rem"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						editableItem={editableItem} isEditing={isEditing}
					/>

					<ItemGenres
						item={movie}
						direction="row" gap=".5rem"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={4}
						editableItem={editableItem} isEditing={isEditing} libraryId={movie.ParentId!}
					/>

					<ItemStudios
						item={movie}
						direction="column" gap=".5rem"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={3}
						editableItem={editableItem} isEditing={isEditing} libraryId={movie.ParentId!}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2rem">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={movie} editableItem={editableItem} isEditing={isEditing} />
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={movie} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(); }} />}
						<ItemActionsMenu items={[movie]} user={user} actions={[
							[ // User-based actions
								PlayVideoAction,
								AddToFavoritesAction,
								MarkPlayedAction,
								AddToCollectionAction,
								AddToPlaylistAction,
							],
							[ // Server-based actions
								EditItemAction,
							]
						]} />
					</Layout>
				</Layout>

				<Layout direction="row" gap="1rem">
					<ItemPremiereDate item={movie} isEditing={isEditing} editableItem={editableItem} />
					<ItemDuration item={movie} />
				</Layout>

				<ItemOverview item={movie} editableItem={editableItem} isEditing={isEditing} />

				<ItemTags
					item={movie}
					isEditing={isEditing} editableItem={editableItem} libraryId={movie.ParentId!}
					direction="row" gap=".5rem" wrap
					linkClassName={background.button}
					linkLayout={{ px: ".25em", py: ".25em" }}
					showMoreLimit={25}
				/>

				<CastAndCrew
					itemWithPeople={movie}
					className={background.panel}
					direction="row" wrap px=".5em" py="1em"
					linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
					editableItem={editableItem}
					isEditing={isEditing}
				/>

				<ItemMediaInfo item={movie} />
			</Layout>
		</Layout>
	);
};
