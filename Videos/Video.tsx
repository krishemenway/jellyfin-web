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
import { ItemPremiereDate } from "Items/ItemPremiereDate";
import { ItemDuration } from "Items/ItemDuration";
import { ChangeImageButton } from "Items/ChangeImageButton";
import { ItemMediaInfo } from "Items/ItemMediaInfo";
import { ItemSortName } from "Items/ItemSortName";

export const Video: React.FC = () => {
	const videoId = useParams<{ videoId: string }>().videoId!;

	const reloadVideo = () => ItemService.Instance.FindOrCreateItemData(videoId).LoadItemWithAbort(true);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(videoId).LoadItemWithAbort(), [videoId]);

	return (
		<PageWithNavigation icon="Video" content={(_, user) => (
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(videoId).Item]}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} retryAction={reloadVideo} />}
				whenReceived={(video) => <LoadedVideo video={video} user={user} reloadVideo={reloadVideo} />}
			/>
		)} />
	);
};

const LoadedVideo: React.FC<{ user: UserDto; video: BaseItemDto; reloadVideo: () => void; }> = ({ user, video, reloadVideo }) => {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(video, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(video), [video]);

	return (
		<Layout direction="row" gap="1em" py="1rem">
			<Layout direction="column" maxWidth="20%" gap=".5rem">
				<Layout direction="column" gap=".5rem">
					<Layout direction="column">
						<Layout direction="column" position="relative">
							<ItemImage item={video} type="Primary" />
							<ItemRating item={video} position="absolute" bottom=".5em" right=".5em" libraryId={video.ParentId!} isEditing={isEditing} editableItem={editableItem} />
						</Layout>
	
						<ChangeImageButton item={video} imageType="Primary" label="ButtonChangeImage" onChanged={() => reloadVideo()} isEditing={isEditing} />
						<ChangeImageButton item={video} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => reloadVideo()} isEditing={isEditing} />
					</Layout>

					<ItemExternalLinks
						item={video}
						direction="row" gap=".5rem"
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						editableItem={editableItem} isEditing={isEditing}
					/>

					<ItemGenres
						item={video}
						direction="row" gap=".5rem"
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={4}
						editableItem={editableItem} isEditing={isEditing} libraryId={video.ParentId!}
					/>

					<ItemStudios
						item={video}
						direction="column" gap=".5rem"
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={3}
						editableItem={editableItem} isEditing={isEditing} libraryId={video.ParentId!}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2rem">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={video} editableItem={editableItem} isEditing={isEditing} />
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={video} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadVideo); }} />}
						<ItemActionsMenu reloadItems={() => reloadVideo()} filteredItems={[video]} user={user} actions={[
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

				<Layout direction="row" gap="1rem">
					<ItemPremiereDate item={video} isEditing={isEditing} editableItem={editableItem} />
					<ItemDuration item={video} />
				</Layout>

				<ItemSortName editableItem={editableItem} isEditing={isEditing} />
				<ItemOverview item={video} editableItem={editableItem} isEditing={isEditing} />

				<ItemTags
					item={video}
					isEditing={isEditing} editableItem={editableItem} libraryId={video.ParentId!}
					direction="row" gap=".5rem" wrap
					linkClasses={[background.button]}
					linkLayout={{ px: ".25em", py: ".25em" }}
					showMoreLimit={25}
				/>

				<CastAndCrew
					itemWithPeople={video}
					backgroundColor="Panel"
					direction="row" wrap px=".5em" py="1em" bt br bb bl
					linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
					editableItem={editableItem}
					isEditing={isEditing}
				/>

				<ItemMediaInfo item={video} />
			</Layout>
		</Layout>
	);
};
