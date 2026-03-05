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
import { PageTitle } from "Common/PageTitle";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { RefreshItemAction } from "MenuActions/RefreshItemAction";
import { ItemOverview } from "Items/ItemOverview";
import { TranslatedText } from "Common/TranslatedText";
import { ItemTags } from "Items/ItemTags";
import { CastAndCrew } from "Items/CastAndCrew";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { Button } from "Common/Button";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { VideoPlayerService } from "Videos/VideoPlayerService";

export const MusicVideo: React.FC = () => {
	const routeParams = useParams<{ musicVideoId: string }>();
	const musicVideoId = routeParams.musicVideoId;

	if (!Nullable.HasValue(musicVideoId)) {
		return <PageWithNavigation icon="MusicVideo"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(musicVideoId).LoadItemWithAbort(), [musicVideoId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(musicVideoId).LoadChildrenWithAbort(true, { recursive: true }), [musicVideoId]);

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

	React.useEffect(() => BackdropService.Instance.SetWithDispose(musicVideo), [musicVideo]);

	return (
		<Layout direction="row" gap="1em" py="1em">
			<Layout direction="column" maxWidth="20%" gap=".5em">
				<Layout direction="column" gap=".5em">
					<Layout direction="column" position="relative">
						<ItemImage item={musicVideo} type="Primary" />
						<ItemRating item={musicVideo} position="absolute" bottom=".5em" right=".5em" />
					</Layout>

					<ItemExternalLinks
						item={musicVideo}
						direction="row" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
					/>

					<ItemGenres
						item={musicVideo}
						direction="row" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={4}
					/>

					<ItemStudios
						item={musicVideo}
						direction="column" gap=".5em"
						linkClassName={background.button}
						linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
						showMoreLimit={3}
					/>
				</Layout>
			</Layout>
			<Layout direction="column" grow gap="2em">
				<Layout direction="row" justifyContent="space-between">
					<PageTitle text={musicVideo.Name} />
					<Button type="button" icon={<PlayIcon />} alignItems="center" px=".5em" py=".5em" onClick={() => VideoPlayerService.Instance.ClearAndPlay([musicVideo])} />
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
							RefreshItemAction,
						]
					]} user={user} />
				</Layout>

				<ItemOverview item={musicVideo} />

				{(musicVideo.Tags?.length ?? 0) > 0 && (
					<Layout direction="row" gap=".5em">
						<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: ".25em", py: ".25em" }} />
						<ItemTags
							item={musicVideo}
							direction="row" gap=".5em" wrap
							linkClassName={background.button}
							linkLayout={{ px: ".25em", py: ".25em" }}
							showMoreLimit={25}
						/>
					</Layout>
				)}

				{(musicVideo.People?.length ?? 0) > 0 && (
					<Layout direction="column" minWidth="100%">
						<Layout direction="row" fontSize="1.5em" py=".5em" px=".5em" className={background.panel}><TranslatedText textKey="HeaderCastAndCrew" /></Layout>

						<CastAndCrew
							itemWithPeople={musicVideo}
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