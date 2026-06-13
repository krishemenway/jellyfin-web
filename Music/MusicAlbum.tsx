import * as React from "react";
import { PageWithNavigation, PageIsLoading } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { NotFound } from "Common/NotFound";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { Button } from "Common/Button";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { MusicPlayerService } from "Music/MusicPlayerService";
import { ItemOverview } from "Items/ItemOverview";
import { ItemTags } from "Items/ItemTags";
import { useBackgroundStyles, useBreakpointValues } from "AppStyles";
import { ItemImage } from "Items/ItemImage";
import { ItemRating } from "Items/ItemRating";
import { ItemStudios } from "Items/ItemStudios";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { useObservable } from "@residualeffect/rereactor";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { EditItemAction } from "MenuActions/EditItemAction";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
import { AddToFavoritesAction, RemoveFromFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { LoginService } from "Users/LoginService";
import { MusicAlbumSongs } from "Music/MusicAlbumSongs";
import { ItemPremiereDate } from "Items/ItemPremiereDate";
import { EditableItemProps } from "Items/EditableItemProps";
import { FieldLabel } from "Common/FieldLabel";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { TranslatedText } from "Common/TranslatedText";
import { HyperLink } from "Common/HyperLink";
import { MusicArtistService } from "Music/MusicArtistService";
import { ItemDuration } from "Items/ItemDuration";
import { ListOf } from "Common/ListOf";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { ChangeImageButton } from "Items/ChangeImageButton";

export const MusicAlbum: React.FC = () => {
	const routeParams = useParams<{ albumId: string; songId?: string; }>();
	const albumId = routeParams.albumId;

	if (!Nullable.HasValue(albumId)) {
		return <PageWithNavigation icon="MusicAlbum"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(albumId).LoadItemWithAbort(), [albumId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(albumId).LoadChildrenWithAbort(false, { albumIds: [albumId], includeItemTypes: ["Audio", "MusicVideo"], recursive: true }), [albumId]);

	return (
		<PageWithNavigation icon="MusicAlbum">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(albumId).Item, ItemService.Instance.FindOrCreateItemData(albumId).Children, LoginService.Instance.User]}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(album, allAlbumItems, user) => <LoadedMusicAlbums album={album} allAlbumItems={allAlbumItems} user={user} reloadAlbum={() => ItemService.Instance.FindOrCreateItemData(albumId).LoadItemWithAbort(true)} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedMusicAlbums: React.FC<{ album: BaseItemDto; allAlbumItems: BaseItemDto[]; user: UserDto; reloadAlbum: () => void; }> = ({ album, allAlbumItems, user, reloadAlbum }) => {
	const allSongs = React.useMemo(() => allAlbumItems.filter((i) => i.Type === "Audio"), [allAlbumItems]);
	const allMusicVideos = React.useMemo(() => allAlbumItems.filter((i) => i.Type === "MusicVideo"), [allAlbumItems]);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);
	const editableItem = useEditableItem(album, user);
	const background = useBackgroundStyles();

	return (
		<Layout direction="column" py="1em">
			<Layout direction="row" gap="1em" py="1em">
				<Layout direction="column" maxWidth="33.333%" gap=".5em">
					<Layout direction="column">
						<Layout direction="column" position="relative">
							<ItemImage item={album} type="Primary" />
							<ItemRating item={album} position="absolute" bottom=".5em" right=".5em" libraryId={album.ParentId!} isEditing={isEditing} editableItem={editableItem} />
						</Layout>
	
						<ChangeImageButton item={album} imageType="Primary" label="ButtonChangeImage" onChanged={() => reloadAlbum()} isEditing={isEditing} />
						<ChangeImageButton item={album} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => reloadAlbum()} isEditing={isEditing} />
					</Layout>

					<ItemStudios
						item={album}
						direction="row" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
						showMoreLimit={3}
						isEditing={isEditing} libraryId={album.ParentId!} editableItem={editableItem}
					/>

					<ItemExternalLinks
						item={album}
						direction="row" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
						editableItem={editableItem} isEditing={isEditing}
					/>

					<ItemGenres
						item={album}
						direction="row" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
						showMoreLimit={4}
						isEditing={isEditing} libraryId={album.ParentId!} editableItem={editableItem}
					/>
				</Layout>

				<Layout direction="column" maxWidth="100em" grow gap="1em">
					<Layout direction="row" justifyContent="space-between" gap="1rem">
						<ItemPageTitle item={album} isEditing={isEditing} editableItem={editableItem} />
						
						<Layout direction="row" gap="1rem">
							{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
							{isEditing && <ItemRefreshButton item={album} />}
							{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadAlbum); }} />}
							<Button type="button" alignItems="center" px=".5em" py=".5em" icon={<PlayIcon />} title={{ Key: "HeaderPlayAll" }} onClick={() => MusicPlayerService.Instance.ClearAndPlay(allSongs)} />
		
							<ItemActionsMenu reloadItems={() => reloadAlbum()} items={[album]} user={user} actions={[
								[
									AddToFavoritesAction,
									RemoveFromFavoritesAction,
									MarkPlayedAction,
									MarkUnplayedAction,
									AddToCollectionAction,
									AddToPlaylistAction,
									EditItemAction
								],
							]} />
						</Layout>
					</Layout>

					<Layout direction="column" gap="1em" maxWidth="95%">
						<Layout direction="row" alignItems="center" gap="1rem">
							<Artists item={album} isEditing={isEditing} editableItem={editableItem} />
						</Layout>

						<Layout direction="row" gap="1rem">
							<ItemPremiereDate item={album} isEditing={isEditing} editableItem={editableItem} />
							<ItemDuration item={album} />
						</Layout>

						<ItemOverview item={album} editableItem={editableItem} isEditing={isEditing} />

						<ItemTags
							item={album}
							direction="row" gap=".5em" wrap
							linkClassName={background.button}
							linkLayout={{ px: ".25em", py: ".25em" }}
							showMoreLimit={25}
							isEditing={isEditing} libraryId={album.ParentId!} editableItem={editableItem}
						/>

						<MusicAlbumSongs addFromChildOfId={album.Id!} allSongs={allSongs} />
						<MusicAlbumVideos allMusicVideos={allMusicVideos} />
					</Layout>
				</Layout>
			</Layout>
		</Layout>
	);
};

const Artists: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<>
				<FieldLabel field={props.editableItem.ArtistItems} />
				<MultiSelectEditor field={props.editableItem.ArtistItems} allOptions={[]} createNew={(v) => ({ Id: undefined, Name: v })} getLabel={(l) => l.Name} getValue={(l) => l.Name!} />
			</>
		);
	}

	if ((props.item.ArtistItems?.length ?? 0) > 0 || (props.item.Artists?.length ?? 0) > 0) {
		return (
			<>
				<Layout direction="row"><TranslatedText textKey="Artists" /></Layout>
				{props.item.ArtistItems?.map((ai) => (
					<HyperLink key={ai.Name} to={MusicArtistService.findUrl!({ Id: ai.Id })!} direction="row" px=".5em" py=".25em">{ai.Name}</HyperLink>
				))}
				{props.item.Artists?.filter((artist) => !Nullable.HasValue(props.item.ArtistItems?.find((artistItem) => artistItem.Name === artist))).map((artist) => (
					<Layout key={artist} direction="row" px=".5em" py=".25em">{artist}</Layout>
				))}
			</>
		);
	}

	return undefined;
};

const MusicAlbumVideos: React.FC<{ allMusicVideos: BaseItemDto[] }> = ({ allMusicVideos }) => {
	const videosPerRow = useBreakpointValues(1, 1, 3, 5);

	return (
		<ListOf
			items={allMusicVideos}
			direction="row" wrap gap="1rem"
			forEachItem={(item) => (
				<ItemsGridItem
					item={item} key={item.Id}
					itemsPerRow={videosPerRow}
				/>
			)}
		/>
	);
};
