import * as React from "react";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
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
import { AddToFavoritesAction, RemoveFromFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
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
import { ChangeImageButton } from "Items/ChangeImageButton";

export const AudioBook: React.FC = () => {
	const audioBookId = useParams<{ audioBookId: string }>().audioBookId;

	if (!Nullable.HasValue(audioBookId)) {
		return <PageWithNavigation icon="AudioBook"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(audioBookId).LoadItemWithAbort(), [audioBookId]);

	return (
		<PageWithNavigation icon="AudioBook">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(audioBookId).Item, LoginService.Instance.User]}
				whenNotStarted={<PageIsLoading />} whenLoading={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(audioBook, user) => <LoadedAudioBook audioBook={audioBook} user={user} reloadAudioBook={() => ItemService.Instance.FindOrCreateItemData(audioBookId).LoadItemWithAbort(true)} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedAudioBook: React.FC<{ user: UserDto; audioBook: BaseItemDto; reloadAudioBook: () => void; }> = ({ user, audioBook, reloadAudioBook }) => {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(audioBook, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(audioBook), [audioBook]);

	return (
		<Layout direction="row" gap="1em" py="1rem">
			<Layout direction="column" maxWidth="20%" gap=".5rem">
				<Layout direction="column" gap=".5rem">
					<Layout direction="column">
						<Layout direction="column" position="relative">
							<ItemImage item={audioBook} type="Primary" />
							<ItemRating item={audioBook} position="absolute" bottom=".5em" right=".5em" libraryId={audioBook.ParentId!} isEditing={isEditing} editableItem={editableItem} />
						</Layout>
	
						<ChangeImageButton item={audioBook} label="ButtonChangeImage" imageType="Primary" onChanged={() => reloadAudioBook()} isEditing={isEditing} />
						<ChangeImageButton item={audioBook} label="ButtonChangeBackdrop" imageType="Backdrop" onChanged={() => reloadAudioBook()} isEditing={isEditing} />
					</Layout>

					<ItemExternalLinks
						item={audioBook}
						direction="row" gap=".5rem"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						editableItem={editableItem} isEditing={isEditing}
					/>

					<ItemGenres
						item={audioBook}
						direction="row" gap=".5rem"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={4}
						editableItem={editableItem} isEditing={isEditing} libraryId={audioBook.ParentId!}
					/>

					<ItemStudios
						item={audioBook}
						direction="column" gap=".5rem"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={3}
						editableItem={editableItem} isEditing={isEditing} libraryId={audioBook.ParentId!}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2rem">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={audioBook} editableItem={editableItem} isEditing={isEditing} />
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={audioBook} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadAudioBook); }} />}
						<ItemActionsMenu reloadItems={() => reloadAudioBook()} items={[audioBook]} user={user} actions={[
							[ // User-based actions
								PlayVideoAction,
								AddToFavoritesAction,
								RemoveFromFavoritesAction,
								MarkPlayedAction,
								MarkUnplayedAction,
								AddToCollectionAction,
								AddToPlaylistAction,
							],
							[ // Server-based actions
								EditItemAction,
							]
						]} />
					</Layout>
				</Layout>

				<ItemOverview item={audioBook} editableItem={editableItem} isEditing={isEditing} />

				<ItemTags
					item={audioBook}
					isEditing={isEditing} editableItem={editableItem} libraryId={audioBook.ParentId!}
					direction="row" gap=".5rem" wrap
					linkClassName={background.button}
					linkLayout={{ px: ".25em", py: ".25em" }}
					showMoreLimit={25}
				/>

				<CastAndCrew
					itemWithPeople={audioBook}
					className={background.panel}
					direction="row" wrap px=".5em" py="1em"
					linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
					editableItem={editableItem}
					isEditing={isEditing}
				/>
			</Layout>
		</Layout>
	)
}