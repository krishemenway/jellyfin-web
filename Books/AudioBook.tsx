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
import { ItemPageTitle } from "Items/ItemPageTitle";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { RefreshItemAction } from "MenuActions/RefreshItemAction";
import { CastAndCrew } from "Items/CastAndCrew";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { BackdropService } from "Common/BackdropService";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { Button } from "Common/Button";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { useObservable } from "@residualeffect/rereactor";
import { RevertIcon } from "CommonIcons/RevertIcon";

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
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(audioBook, user) => <LoadedAudioBook audioBook={audioBook} user={user} />}
			/>
		</PageWithNavigation>
	);
};

function LoadedAudioBook({ user, audioBook }: { user: UserDto, audioBook: BaseItemDto }): JSX.Element {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(audioBook, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(audioBook), [audioBook]);

	return (
		<Layout direction="row" gap="1em" py="1rem">
			<Layout direction="column" maxWidth="20%" gap=".5rem">
				<Layout direction="column" gap=".5rem">
					<Layout direction="column" position="relative">
						<ItemImage item={audioBook} type="Primary" />
						<ItemRating item={audioBook} position="absolute" bottom=".5rem" right=".5rem" editableItem={editableItem} libraryId={audioBook.ParentId!} isEditing={isEditing} />
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
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2rem">
				<Layout direction="row" justifyContent="space-between">
					<ItemPageTitle item={audioBook} editableItem={editableItem} isEditing={isEditing} />
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(); }} />}
						<ItemActionsMenu items={[audioBook]} user={user} actions={[
							[ // User-based actions
								PlayVideoAction,
								AddToFavoritesAction,
								MarkPlayedAction,
								AddToCollectionAction,
								AddToPlaylistAction,
							],
							[ // Server-based actions
								EditItemAction,
								RefreshItemAction,
							]
						]} />
					</Layout>
				</Layout>

				<ItemOverview item={audioBook} editableItem={editableItem} isEditing={isEditing} />

				{(audioBook.Tags?.length ?? 0) > 0 && (
					<Layout direction="row" gap=".5rem">
						<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: ".25em", py: ".25em" }} />
						<ItemTags
							item={audioBook}
							isEditing={isEditing} editableItem={editableItem} libraryId={audioBook.ParentId!}
							direction="row" gap=".5rem" wrap
							linkClassName={background.button}
							linkLayout={{ px: ".25em", py: ".25em" }}
							showMoreLimit={25}
						/>
					</Layout>
				)}

				{(audioBook.People?.length ?? 0) > 0 && (
					<Layout direction="column" minWidth="100%">
						<Layout direction="row" fontSize="1.5em" py=".5em" px=".5em" className={background.panel}><TranslatedText textKey="HeaderCastAndCrew" /></Layout>

						<CastAndCrew
							itemWithPeople={audioBook}
							className={background.panel}
							direction="row" wrap px=".5em" py="1em"
							linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
							editableItem={editableItem}
							isEditing={isEditing}
						/>
					</Layout>
				)}
			</Layout>
		</Layout>
	)
}