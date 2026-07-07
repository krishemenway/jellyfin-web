import * as React from "react";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemImage } from "Items/ItemImage";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { BackdropService } from "Common/BackdropService";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { Button } from "Common/Button";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { useBackgroundStyles, useBreakpointValues } from "AppStyles";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { useObservable } from "@residualeffect/rereactor";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { EditItemAction } from "MenuActions/EditItemAction";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { ItemOverview } from "Items/ItemOverview";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { ListOf } from "Common/ListOf";
import { SortByIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";
import { MusicAlbumSongs } from "Music/MusicAlbumSongs";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { LinkToItem } from "Items/LinkToItem";
import { ItemGenres } from "Items/ItemGenres";
import { ChangeImageButton } from "Items/ChangeImageButton";
import { AddToFavoritesAction, RemoveFromFavoritesAction } from "MenuActions/AddToFavoritesAction";

export const MusicArtist: React.FC = () => {
	const artistId = useParams().artistId!;

	const reloadArtist = React.useCallback(() => ItemService.Instance.FindOrCreateItemData(artistId).LoadItemWithAbort(true),[artistId])
	const reloadChildren = React.useCallback(() => ItemService.Instance.FindOrCreateItemData(artistId).LoadChildrenWithAbort(false, { artistIds: [artistId], includeItemTypes: ["MusicVideo", "MusicAlbum", "Audio"], recursive: true }), [artistId]);

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(artistId).LoadItemWithAbort(), [artistId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(artistId).LoadChildrenWithAbort(false, { artistIds: [artistId], includeItemTypes: ["MusicVideo", "MusicAlbum", "Audio"], recursive: true }), [artistId]);

	return (
		<PageWithNavigation icon="MusicArtist" content={(_, user) => (
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(artistId).Item]}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} retryAction={reloadArtist} />}
				whenReceived={(artist) => <LoadedMusicArtist user={user} artist={artist} reloadArtist={reloadArtist} reloadChildren={reloadChildren} />}
			/>
		)} />
	);
};

const LoadedMusicArtist: React.FC<{ user: UserDto; artist: BaseItemDto; reloadArtist: () => void; reloadChildren: () => void; }> = ({ user, artist, reloadArtist, reloadChildren }) => {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(artist, user);
	const genresPerRow = useBreakpointValues(1, 3, 3, 3);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(artist), [artist]);

	return (
		<Layout direction="row" gap="1em" py="1rem">
			<Layout direction="column" maxWidth="20%" gap=".5rem">
				<Layout direction="column" gap=".5rem">
					<Layout direction="column">
						<ItemImage item={artist} type="Primary" />
						<ChangeImageButton item={artist} imageType="Primary" label="ButtonChangeImage" onChanged={() => reloadArtist()} isEditing={isEditing} />
						<ChangeImageButton item={artist} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => reloadArtist()} isEditing={isEditing} />
					</Layout>

					<ItemGenres
						item={artist}
						direction="row" gap=".5rem" wrap
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: { itemsPerRow: genresPerRow, gap: ".5rem" }, py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						editableItem={editableItem} isEditing={isEditing}
					/>

					<ItemExternalLinks
						item={artist}
						direction="row" gap=".5rem"
						linkClasses={[background.button]}
						linkLayout={{ direction: "column", width: "100%", py: ".5rem", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						editableItem={editableItem} isEditing={isEditing}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2rem">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={artist} editableItem={editableItem} isEditing={isEditing} />
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={artist} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadArtist); }} />}
						<ItemActionsMenu reloadItems={() => { reloadArtist(); reloadChildren(); }} filteredItems={[artist]} user={user} actions={[
							[
								EditItemAction,
								AddToFavoritesAction,
								RemoveFromFavoritesAction,
							]
						]} />
					</Layout>
				</Layout>

				<ItemOverview item={artist} editableItem={editableItem} isEditing={isEditing} />

				<Loading
					receivers={[ItemService.Instance.FindOrCreateItemData(artist.Id!).Children]}
					whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
					whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
					whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} retryAction={reloadChildren} />}
					whenReceived={(relatedItemsToArtist) => <Albums artist={artist} relatedItemsToArtist={relatedItemsToArtist} />}
				/>
			</Layout>
		</Layout>
	);
};

const Albums: React.FC<{ artist: BaseItemDto; relatedItemsToArtist: BaseItemDto[] }> = ({ artist, relatedItemsToArtist }) => {
	const musicVideosPerRow = useBreakpointValues(1, 1, 3, 5);
	const albumsAndVideos = React.useMemo(() => relatedItemsToArtist.filter((i) => i.Type === "MusicAlbum" || (i.Type === "MusicVideo")).sort((a, b) => SortByPremiereDate.sortFunc(a, b) * -1), [relatedItemsToArtist]);

	return (
		<ListOf
			direction="row" gap="1rem" wrap
			items={albumsAndVideos}
			forEachItem={(item) => item.Type === "MusicAlbum" ? (
				<Album key={item.Id} artist={artist} album={item} relatedItemsToArtist={relatedItemsToArtist} />
			) : (
				<ItemsGridItem key={item.Id} item={item} itemsPerRow={musicVideosPerRow} />
			)}
		/>
	);
};

const Album: React.FC<{ artist: BaseItemDto; album: BaseItemDto; relatedItemsToArtist: BaseItemDto[]; }> = ({ artist, album, relatedItemsToArtist }) => {
	const albumsPerRow = useBreakpointValues(1, 1, 2, 2);
	const songs = React.useMemo(() => relatedItemsToArtist.filter((i) => i.Type === "Audio" && i.AlbumId === album.Id).sort(SortByIndexNumber.sortFunc), [album, relatedItemsToArtist]);

	return (
		<Layout direction="row" gap="1rem" width={{ itemsPerRow: albumsPerRow, gap: "1rem" }} backgroundColor="Panel" bt br bb bl py=".25rem">
			<LinkToItem item={album} direction="column" px="1rem" width="18rem" alignItems="center" justifyContent="center">
				<ItemImage width="100%" item={album} type="Primary" />
			</LinkToItem>
			<Layout direction="column" grow px=".5rem">
				<Layout direction="row" fontSizeREM={1.5} py=".25em">{album.Name}</Layout>
				<MusicAlbumSongs addFromChildOfId={artist.Id!} allSongs={songs} />
			</Layout>
		</Layout>
	);
};
