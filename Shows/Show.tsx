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
import { CenteredModal } from "Common/Modal";
import { CastAndCrew } from "Items/CastAndCrew";
import { BackdropService } from "Common/BackdropService";

export const Show: React.FC = () => {
	const routeParams = useParams<{ showId: string; seasonId?: string; episodeId?: string }>();
	const showId = routeParams.showId;

	if (!Nullable.HasValue(showId)) {
		return <PageWithNavigation icon="Series"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(showId).LoadItemWithAbort(), [showId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(showId).LoadChildrenWithAbort(), [showId]);

	return (
		<PageWithNavigation icon="Series">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(showId).Item, ItemService.Instance.FindOrCreateItemData(showId).Children, LoginService.Instance.User]}
				whenNotStarted={<LoadingIcon size="3em" />}
				whenLoading={<LoadingIcon size="3em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(show, seasons, user) => <LoadedShow show={show} seasons={seasons} user={user} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedShow: React.FC<{ show: BaseItemDto; seasons: BaseItemDto[]; user: UserDto }> = ({ show, seasons, user }) => {
	const background = useBackgroundStyles();
	const [selectedEpisode, setSelectedEpisode] = React.useState<BaseItemDto|undefined>(undefined);

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

				<CastAndCrewSection show={show} />

				<ListOf
					items={seasons}
					direction="column" gap=".5em"
					forEachItem={(season) => <SeasonForShow key={season.Id} season={season} />}
				/>
			</Layout>

			<CenteredModal open={selectedEpisode !== undefined} onClosed={() => setSelectedEpisode(undefined)}>
				<EpisodeDetails episode={selectedEpisode} />
			</CenteredModal>
		</Layout>
	);
};

const EpisodeDetails: React.FC<{ episode: BaseItemDto|undefined }> = (props) => {
	if (!Nullable.HasValue(props.episode)) {
		return <></>;
	}

	return (
		<Layout direction="row">
			<Layout direction="column">
				{props.episode.Name}
			</Layout>

			<Layout direction="column">
				Something else?
			</Layout>
		</Layout>
	);
};

const SeasonForShow: React.FC<{ season: BaseItemDto }> = (props) => {
	const [seasonOpen, setSeasonOpen] = React.useState(props.season.IndexNumber === 1);
	const seasonId = props.season.Id;

	if (!Nullable.HasValue(seasonId)) {
		return <></>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(seasonId).LoadChildrenWithAbort(), [props.season]);

	return (
		<Layout direction="column" minWidth="100%">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(seasonId).Children]}
				whenNotStarted={<LoadingIcon size="3em" />}
				whenLoading={<LoadingIcon size="3em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(episodes) => (
					<>
						<Button type="button" onClick={() => setSeasonOpen(!seasonOpen)} direction="row" fontSize="1.5em" py=".5em" px=".5em" gap=".5em">
							<Layout direction="row">{props.season.Name}</Layout>
							<Layout direction="row"><ProductionYearRangeForEpisodes episodes={episodes} /></Layout>
						</Button>

						<Collapsible open={seasonOpen}>
							<ItemsRow items={episodes} itemName={(item) => `${item.IndexNumber}. ${item.Name}`} />
						</Collapsible>
					</>
				)}
			/>
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
