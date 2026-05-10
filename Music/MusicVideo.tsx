import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { NotFound } from "Common/NotFound";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemService } from "Items/ItemsService";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { LoginService } from "Users/LoginService";
import { Layout } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";
import { BackdropService } from "Common/BackdropService";
import { ItemImage } from "Items/ItemImage";
import { ItemRating } from "Items/ItemRating";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { ItemStudios } from "Items/ItemStudios";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { ItemOverview } from "Items/ItemOverview";
import { TranslatedText } from "Common/TranslatedText";
import { ItemTags } from "Items/ItemTags";
import { CastAndCrew } from "Items/CastAndCrew";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { Button } from "Common/Button";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { VideoPlayerService } from "Videos/VideoPlayerService";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { useObservable } from "@residualeffect/rereactor";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { EditableItemProps } from "Items/EditableItemProps";
import { TextField } from "Common/TextField";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { HyperLink } from "Common/HyperLink";
import { FieldLabel } from "Common/FieldLabel";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { ItemPremiereDate } from "Items/ItemPremiereDate";
import { ItemDuration } from "Items/ItemDuration";

export const MusicVideo: React.FC = () => {
	const routeParams = useParams<{ musicVideoId: string }>();
	const musicVideoId = routeParams.musicVideoId;

	if (!Nullable.HasValue(musicVideoId)) {
		return <PageWithNavigation icon="MusicVideo"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(musicVideoId).LoadItemWithAbort(), [musicVideoId]);

	return (
		<PageWithNavigation icon="Series">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(musicVideoId).Item, LoginService.Instance.User]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(musicVideo, user) => <LoadedMusicVideo musicVideo={musicVideo} user={user} />}
			/>
		</PageWithNavigation>
	);
};

function LoadedMusicVideo({ user, musicVideo }: { user: UserDto, musicVideo: BaseItemDto }): JSX.Element {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(musicVideo, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(musicVideo), [musicVideo]);

	return (
		<Layout direction="row" gap="1em" py="1em">
			<Layout direction="column" maxWidth="20%" gap=".5em">
				<Layout direction="column" gap=".5em">
					<Layout direction="column" position="relative">
						<ItemImage item={musicVideo} type="Primary" />
						<ItemRating item={musicVideo} position="absolute" bottom=".5em" right=".5em" isEditing={isEditing} editableItem={editableItem} libraryId={musicVideo.ParentId!} />
					</Layout>

					<ItemExternalLinks
						item={musicVideo}
						direction="row" gap=".5em" wrap
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						editableItem={editableItem} isEditing={isEditing}
					/>

					<ItemGenres
						item={musicVideo}
						direction="row" gap=".5em" wrap
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={4}
						editableItem={editableItem} isEditing={isEditing} libraryId={musicVideo.ParentId!}
					/>

					<ItemStudios
						item={musicVideo}
						direction="column" gap=".5em" wrap
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={3}
						editableItem={editableItem} isEditing={isEditing} libraryId={musicVideo.ParentId!}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="1rem">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={musicVideo} isEditing={isEditing} editableItem={editableItem} />
					<Layout direction="row" gap="1rem">
						{!isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<PlayIcon />} onClick={() => { VideoPlayerService.Instance.ClearAndPlay([musicVideo]) }} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={musicVideo} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(); }} />}
						<ItemActionsMenu items={[musicVideo]} actions={[
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
						]} user={user} />
					</Layout>
				</Layout>

				<Layout direction="row" alignItems="center" gap="1rem">
					<AlbumName item={musicVideo} isEditing={isEditing} editableItem={editableItem} />
					<Artists item={musicVideo} isEditing={isEditing} editableItem={editableItem} />
				</Layout>

				<Layout direction="row" gap="1rem">
					<ItemPremiereDate item={musicVideo} isEditing={isEditing} editableItem={editableItem} />
					<ItemDuration item={musicVideo} />
				</Layout>

				<ItemOverview item={musicVideo} isEditing={isEditing} editableItem={editableItem} />

				<ItemTags
					item={musicVideo}
					direction="row" gap=".5em" wrap
					linkClassName={background.button}
					linkLayout={{ px: ".25em", py: ".25em" }}
					showMoreLimit={25}
					isEditing={isEditing} editableItem={editableItem} libraryId={musicVideo.ParentId!}
				/>

				<Layout direction="column" minWidth="100%">
					<Layout direction="row" fontSize="1.5em" py=".5em" px=".5em" className={background.panel}><TranslatedText textKey="HeaderCastAndCrew" /></Layout>

					<CastAndCrew
						itemWithPeople={musicVideo}
						className={background.panel}
						direction="row" wrap px=".5em" py="1em"
						linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
						isEditing={isEditing} editableItem={editableItem}
					/>
				</Layout>
			</Layout>
		</Layout>
	)
};

const AlbumName: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<>
				<FieldLabel field={props.editableItem.Album} />
				<TextField field={props.editableItem.Album} py=".5em" px=".25em" />
			</>
		);
	}

	if (Nullable.HasValue(props.item.AlbumId)) {
		return (
			<>
				<Layout direction="row"><TranslatedText textKey="Album" /></Layout>
				<HyperLink to={BaseItemKindServiceFactory.FindOrNull("MusicAlbum")?.findUrl!({ Id: props.item.AlbumId })!} direction="row" px=".5em" py=".25em">{props.item.Album}</HyperLink>
			</>
		);
	}

	if (Nullable.HasValue(props.item.Album)) {
		return (
			<>
				<Layout direction="row"><TranslatedText textKey="Album" /></Layout>
				<Layout direction="row" px=".5em" py=".25em">{props.item.Album}</Layout>
			</>
		);
	}

	return undefined;
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
					<HyperLink key={ai.Name} to={BaseItemKindServiceFactory.FindOrNull("MusicArtist")?.findUrl!({ Id: ai.Id })!} direction="row" px=".5em" py=".25em">{ai.Name}</HyperLink>
				))}
				{props.item.Artists?.filter((artist) => !Nullable.HasValue(props.item.ArtistItems?.find((artistItem) => artistItem.Name === artist))).map((artist) => (
					<Layout key={artist} direction="row" px=".5em" py=".25em">{artist}</Layout>
				))}
			</>
		);
	}

	return undefined;
};
