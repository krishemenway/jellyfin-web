import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { NotFound } from "Common/NotFound";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemService } from "Items/ItemsService";
import { ListOf } from "Common/ListOf";
import { ItemsRow } from "Items/ItemsRow";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ItemImage } from "Items/ItemImage";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { ItemTags } from "Items/ItemTags";
import { ItemRating } from "Items/ItemRating";
import { useBackgroundStyles } from "AppStyles";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { Collapsible } from "Common/Collapsible";
import { Button } from "Common/Button";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { ItemStudios } from "Items/ItemStudios";
import { TranslatedText } from "Common/TranslatedText";
import { ItemOverview } from "Items/ItemOverview";
import { LoginService } from "Users/LoginService";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { PageTitle } from "Common/PageTitle";
import { EditItemAction } from "MenuActions/EditItemAction";
import { RefreshItemAction } from "MenuActions/RefreshItemAction";
import { CastAndCrew } from "Items/CastAndCrew";
import { BackdropService } from "Common/BackdropService";

export const Show: React.FC = () => {
	const routeParams = useParams<{ showId: string; seasonId?: string; episodeId?: string }>();
	const showId = routeParams.showId;

	if (!Nullable.HasValue(showId)) {
		return <PageWithNavigation icon="Series"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(showId).LoadItemWithAbort(), [showId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(showId).LoadChildrenWithAbort(true, { recursive: true }), [showId]);

	return (
		<PageWithNavigation icon="Series">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(showId).Item, ItemService.Instance.FindOrCreateItemData(showId).Children, LoginService.Instance.User]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(show, children, user) => <LoadedShow show={show} children={children} user={user} seasonId={routeParams.seasonId} episodeId={routeParams.episodeId} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedShow: React.FC<{ show: BaseItemDto; children: BaseItemDto[]; user: UserDto; seasonId?: string; episodeId?: string; }> = ({ show, children, user, episodeId }) => {
	const background = useBackgroundStyles();
	const seasons = React.useMemo(() => children.filter((i) => i.Type === "Season"), [children]);
	const allEpisodes = React.useMemo(() => children.filter((i) => i.Type === "Episode"), [children]);
	const selectedEpisode = Nullable.ValueOrDefault(episodeId, undefined, (e) => allEpisodes.find((i) => i.Id === e));

	React.useEffect(() => BackdropService.Instance.SetWithDispose(show), [show]);

	return (
		<Layout direction="row" gap="1em" py="1em">
			<PageTitle text={show.Name} />
			<Layout direction="column" maxWidth="20%" gap=".5em">
				<Layout direction="column" position="relative">
					<ItemImage item={show} type="Primary" />
					<ItemRating item={show} position="absolute" bottom=".5em" right=".5em" />
				</Layout>

				<ItemStudios
					item={show}
					direction="row" gap=".5em"
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					showMoreLimit={3}
				/>

				<ItemExternalLinks
					item={show}
					direction="row" gap=".5em"
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
				/>

				<ItemGenres
					item={show}
					direction="row" gap=".5em"
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					showMoreLimit={4}
				/>
			</Layout>

			{Nullable.ValueOrDefault(selectedEpisode, <ShowDetails show={show} user={user} seasons={seasons} allEpisodes={allEpisodes} />, (episode) => (
				<EpisodeDetails episode={episode} user={user} />
			))}
		</Layout>
	);
};

const ShowDetails: React.FC<{ show: BaseItemDto; seasons: BaseItemDto[]; user: UserDto; allEpisodes: BaseItemDto[] }> = ({ show, seasons, user, allEpisodes }) => {
	const background = useBackgroundStyles();
	return (
		<Layout direction="column" grow gap="1.5em">
			<Layout direction="row" justifyContent="space-between">
				<Layout direction="row" fontSize="2em" className="show-name">{show.Name}</Layout>
				<ItemActionsMenu items={[show]} user={user} actions={[
					[ // User-based actions
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

			<ItemOverview item={show} />

			{(show.Tags?.length ?? 0) > 0 && (
				<Layout direction="row" gap=".5em">
					<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: ".25em", py: ".25em" }} />
					<ItemTags
						item={show}
						direction="row" gap=".5em" wrap
						linkClassName={background.button}
						linkLayout={{ px: ".25em", py: ".25em" }}
						showMoreLimit={25}
					/>
				</Layout>
			)}

			<CastAndCrewSection show={show} />

			<ListOf
				items={seasons}
				direction="column" gap=".5em"
				forEachItem={(season) => <SeasonForShow key={season.Id} season={season} allEpisodes={allEpisodes} />}
			/>
		</Layout>
	)
};

const EpisodeDetails: React.FC<{ episode: BaseItemDto; user: UserDto; }> = ({ episode, user }) => {
	const background = useBackgroundStyles();
	return (
		<Layout direction="column" grow gap="1.5em">
			<Layout direction="column" gap=".5em">
				<Layout direction="row" justifyContent="space-between">
					<Layout direction="row" fontSize="2em" className="show-name">{episode.SeriesName}</Layout>
					<ItemActionsMenu items={[episode]} user={user} actions={[
						[ // User-based actions
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
				<Layout direction="row" fontSize="1.3em" className="show-name">{episode.SeasonName} <TranslatedText textKey="Episode" /> {episode.IndexNumber}&nbsp;&ndash;&nbsp;{episode.Name}</Layout>
			</Layout>

			<ItemOverview item={episode} />

			{(episode.Tags?.length ?? 0) > 0 && (
				<Layout direction="row" gap=".5em">
					<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: ".25em", py: ".25em" }} />
					<ItemTags
						item={episode}
						direction="row" gap=".5em" wrap
						linkClassName={background.button}
						linkLayout={{ px: ".25em", py: ".25em" }}
						showMoreLimit={25}
					/>
				</Layout>
			)}

			{(episode.People?.length ?? 0) > 0 && (
				<Layout direction="column" minWidth="100%">
					<Layout direction="row" fontSize="1.5em" py=".5em" px=".5em" className={background.panel}><TranslatedText textKey="HeaderCastAndCrew" /></Layout>

					<CastAndCrew
						itemWithPeople={episode}
						className={background.panel}
						direction="row" wrap px=".5em" py="1em"
						linkProps={({ px: ".5em", py: ".5em", gap: ".25em" })}
					/>
				</Layout>
			)}
		</Layout>
	);
};

const SeasonForShow: React.FC<{ season: BaseItemDto; allEpisodes: BaseItemDto[]; }> = ({ season, allEpisodes }) => {
	const [seasonOpen, setSeasonOpen] = React.useState(season.IndexNumber === 1);

	if (!Nullable.HasValue(season.Id)) {
		return <></>;
	}

	const episodes = React.useMemo(() => allEpisodes.filter((e) => e.SeasonId === season.Id), [season, allEpisodes]);

	return (
		<Layout direction="column" minWidth="100%">
			<Button type="button" onClick={() => setSeasonOpen(!seasonOpen)} direction="row" fontSize="1.5em" py=".5em" px=".5em" gap=".5em">
				<Layout direction="row">{season.Name}</Layout>
				<Layout direction="row"><ProductionYearRangeForEpisodes episodes={episodes} /></Layout>
			</Button>

			<Collapsible open={seasonOpen}>
				<ItemsRow items={episodes} itemName={(item) => `${item.IndexNumber}. ${item.Name}`} />
			</Collapsible>
		</Layout>
	);
};

const ProductionYearRangeForEpisodes: React.FC<{ episodes: BaseItemDto[] }> = (props) => {
	const allYears = React.useMemo(() => props.episodes.filter((e) => Nullable.HasValue(e.ProductionYear)).map((e) => e.ProductionYear), [props.episodes]);
	const earliest = React.useMemo(() => Linq.Min(allYears, (e) => e), [allYears]);
	const newest = React.useMemo(() => Linq.Max(allYears, (e) => e), [allYears]);

	return <>({earliest !== newest ? `${earliest} - ${newest}` : earliest})</>;
};

const CastAndCrewSection: React.FC<{ show: BaseItemDto }> = (props) => {
	const [open, setOpen] = React.useState(false);
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(props.show.People) || props.show.People.length === 0 ) {
		return <></>;
	}

	return (
		<Layout direction="column" minWidth="100%">
			<Button type="button" label="HeaderCastAndCrew" onClick={() => setOpen(!open)} direction="row" fontSize="1.5em" py=".5em" px=".5em" gap=".5em" />

			<Collapsible open={open}>
				<CastAndCrew
					className={background.panel}
					itemWithPeople={props.show}
					direction="row" wrap
					linkProps={{ px: ".5em", py: ".5em", gap: ".25em" }}
				/>
			</Collapsible>
		</Layout>
	);
};
