import * as React from "react";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client";
import { useParams } from "react-router-dom";
import { useObservable } from "@residualeffect/rereactor";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { ItemGenres } from "Items/ItemGenres";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ChangeImageButton } from "Items/ChangeImageButton";
import { ItemImage } from "Items/ItemImage";
import { ItemRating } from "Items/ItemRating";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { useBackgroundStyles, useBreakpointValues } from "AppStyles";
import { Button } from "Common/Button";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { EditItemAction } from "MenuActions/EditItemAction";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { AddToFavoritesAction, RemoveFromFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { ItemOverview } from "Items/ItemOverview";
import { ItemSortName } from "Items/ItemSortName";
import { ItemPremiereDate } from "Items/ItemPremiereDate";
import { ItemDuration } from "Items/ItemDuration";
import { ItemTags } from "Items/ItemTags";
import { CastAndCrew } from "Items/CastAndCrew";
import { LinkToItem } from "Items/LinkToItem";
import { PageTitle } from "Common/PageTitle";

export const Photo: React.FC = () => {
	const photoId = useParams().photoId!;
	const reloadPhoto = React.useCallback(() => ItemService.Instance.FindOrCreateItemData(photoId).LoadItemWithAbort(true), [photoId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(photoId).LoadItemWithAbort(), [photoId]);

	return (
		<PageWithNavigation icon="PhotoAlbum" content={(_, user) => (
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(photoId).Item]}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(photo) => <LoadedPhoto user={user} photo={photo} reloadPhoto={reloadPhoto} />}
			/>
		)} />
	);
};

const LoadedPhoto: React.FC<{ photo: BaseItemDto; user: UserDto; reloadPhoto: () => void; }> = ({ photo, user, reloadPhoto }) => {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(photo, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);
	const leftColumnWidth = useBreakpointValues(undefined, "20%", "20%", "20%");
	const rootDirection = useBreakpointValues("column", "row", "row", "row");

	return (
		<Layout direction={rootDirection} gap="1em" py="1rem">
			<Layout direction="column" maxWidth={leftColumnWidth} gap=".5rem">
				<Layout direction="column">
					<Layout direction="column" position="relative">
						<ItemRating item={photo} position="absolute" bottom=".5em" right=".5em" libraryId={photo.ParentId!} isEditing={isEditing} editableItem={editableItem} />
					</Layout>

					<ChangeImageButton item={photo} imageType="Primary" label="ButtonChangeImage" onChanged={() => reloadPhoto()} isEditing={isEditing} />
					<ChangeImageButton item={photo} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => reloadPhoto()} isEditing={isEditing} />
				</Layout>

				<ItemExternalLinks
					item={photo}
					direction="row" gap=".5rem"
					linkClasses={[background.button]}
					linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
					editableItem={editableItem} isEditing={isEditing}
				/>

				<ItemGenres
					item={photo}
					direction="row" gap=".5rem"
					linkClasses={[background.button]}
					linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
					showMoreLimit={4}
					editableItem={editableItem} isEditing={isEditing} libraryId={photo.ParentId!}
				/>
			</Layout>
			<Layout direction="column" grow gap="1rem">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<LinkToItem item={photo} direction="row"><PageTitle text={photo.Name} /></LinkToItem>
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={photo} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadPhoto); }} />}
						<ItemActionsMenu reloadItems={() => reloadPhoto()} filteredItems={[photo]} user={user} actions={[
							[
								EditItemAction,
								PlayVideoAction,
								AddToFavoritesAction,
								RemoveFromFavoritesAction,
								MarkPlayedAction,
								MarkUnplayedAction,
								AddToCollectionAction,
								AddToPlaylistAction,
							]
						]} />
					</Layout>
				</Layout>

				<ItemPageTitle item={photo} editableItem={editableItem} isEditing={isEditing} fontSizeREM={1.2} />

				<Layout direction="row" gap="1rem">
					<ItemPremiereDate item={photo} isEditing={isEditing} editableItem={editableItem} />
					<ItemDuration item={photo} />
				</Layout>

				<ItemSortName editableItem={editableItem} isEditing={isEditing} />
				<ItemOverview item={photo} editableItem={editableItem} isEditing={isEditing} />

				<ItemTags
					item={photo}
					isEditing={isEditing} editableItem={editableItem} libraryId={photo.ParentId!}
					direction="row" gap=".5rem" wrap
					linkClasses={[background.button]}
					linkLayout={{ px: ".25em", py: ".25em" }}
					showMoreLimit={25}
				/>

				<CastAndCrew
					itemWithPeople={photo}
					backgroundColor="Panel"
					direction="row" wrap px=".5em" py="1em" bt br bb bl
					linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
					editableItem={editableItem}
					isEditing={isEditing}
				/>

				<Layout direction="column" width="100%" alignItems="center" justifyContent="center">
					<ItemImage item={photo} type="Primary" maxWidth="100%" />
				</Layout>
			</Layout>
		</Layout>
	)
};
