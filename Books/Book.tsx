import * as React from "react";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { useParams } from "react-router-dom";
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
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { ItemOverview } from "Items/ItemOverview";
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

export const Book: React.FC = () => {
	const bookId = useParams<{ bookId: string }>().bookId!;

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(bookId).LoadItemWithAbort(), [bookId]);

	return (
		<PageWithNavigation icon="Book" content={(_, user) => (
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(bookId).Item]}
				whenNotStarted={<PageIsLoading />} whenLoading={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(book) => <LoadedBook book={book} user={user} reloadBook={() => ItemService.Instance.FindOrCreateItemData(bookId).LoadItemWithAbort(true)} />}
			/>
		)} />
	);
};

export const LoadedBook: React.FC<{ user: UserDto; book: BaseItemDto; reloadBook: () => void; }> = ({ user, book, reloadBook }) => {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(book, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(book), [book]);

	return (
		<Layout direction="row" gap="1em" py="1rem">
			<Layout direction="column" maxWidth="20%" gap=".5rem">
				<Layout direction="column" gap=".5rem">
					<Layout direction="column">
						<Layout direction="column" position="relative">
							<ItemImage item={book} type="Primary" />
							<ItemRating item={book} position="absolute" bottom=".5em" right=".5em" libraryId={book.ParentId!} isEditing={isEditing} editableItem={editableItem} />
						</Layout>
	
						<ChangeImageButton item={book} imageType="Primary" label="ButtonChangeImage" onChanged={() => reloadBook()} isEditing={isEditing} />
						<ChangeImageButton item={book} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => reloadBook()} isEditing={isEditing} />
					</Layout>

					<ItemExternalLinks
						item={book}
						direction="row" gap=".5rem"
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						editableItem={editableItem} isEditing={isEditing}
					/>

					<ItemGenres
						item={book}
						direction="row" gap=".5rem"
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={4}
						editableItem={editableItem} isEditing={isEditing} libraryId={book.ParentId!}
					/>

					<ItemStudios
						item={book}
						direction="column" gap=".5rem"
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={3}
						editableItem={editableItem} isEditing={isEditing} libraryId={book.ParentId!}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2rem">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={book} editableItem={editableItem} isEditing={isEditing} />
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={book} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadBook); }} />}
						<ItemActionsMenu reloadItems={() => reloadBook()} filteredItems={[book]} user={user} actions={[
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

				<ItemOverview item={book} editableItem={editableItem} isEditing={isEditing} />

				<ItemTags
					item={book}
					isEditing={isEditing} editableItem={editableItem} libraryId={book.ParentId!}
					direction="row" gap=".5rem" wrap
					linkClasses={[background.button]}
					linkLayout={{ px: ".25em", py: ".25em" }}
					showMoreLimit={25}
				/>

				<CastAndCrew
					itemWithPeople={book}
					backgroundColor="Panel" bt br bb bl
					direction="row" wrap px=".5em" py="1em"
					linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
					editableItem={editableItem}
					isEditing={isEditing}
				/>
			</Layout>
		</Layout>
	);
};
