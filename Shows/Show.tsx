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
import { BaseItemDto, BaseItemPerson } from "@jellyfin/sdk/lib/generated-client/models";
import { ItemImage } from "Items/ItemImage";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { ItemTags } from "Items/ItemTags";
import { ItemRating } from "Items/ItemRating";
import { ResponsiveBreakpoint, useBackgroundStyles, useBreakpointValue } from "AppStyles";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { Collapsible } from "Common/Collapsible";
import { Button } from "Common/Button";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { ItemStudios } from "Items/ItemStudios";
import { TranslatedText } from "Common/TranslatedText";
import { DownloadIcon } from "CommonIcons/DownloadIcon";
import { EditIcon } from "CommonIcons/EditIcon";
import { IdentifyIcon } from "Items/IdentifyIcon";
import { RefreshIcon } from "CommonIcons/RefreshIcon";
import { ItemOverview } from "Items/ItemOverview";
import { LinkToPerson } from "People/LinkToPerson";
import { LoginService } from "Users/LoginService";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { PageTitle } from "Common/PageTitle";

export const Show: React.FC = () => {
	const background = useBackgroundStyles();
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
				whenNotStarted={<LoadingIcon size={48} />}
				whenLoading={<LoadingIcon size={48} />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(show, seasons, user) => (
					<Layout direction="row" gap={16} py={16}>
						<PageTitle text={show.Name} />
						<Layout direction="column" maxWidth="20%" gap={8}>
							<Layout direction="column" position="relative">
								<ItemImage item={show} type="Primary" />
								<ItemRating item={show} position="absolute" bottom={8} right={8} />
							</Layout>

							<ItemStudios
								item={show}
								direction="row" gap={8}
								linkClassName={background.button}
								linkLayout={{ direction: "column", width: "100%", py: 8, textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
							/>

							<ItemExternalLinks
								item={show}
								direction="row" gap={8}
								linkClassName={background.button}
								linkLayout={{ direction: "column", width: "100%", py: 8, textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
							/>

							<ItemGenres
								item={show}
								direction="row" gap={8}
								linkClassName={background.button}
								linkLayout={{ direction: "column", width: "100%", py: 8, textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
							/>
						</Layout>

						<Layout direction="column" grow gap={24}>
							<Layout direction="row" fontSize="2em" justifyContent="space-between">
								<Layout direction="row" className="show-name">{show.Name}</Layout>
								<ItemActionsMenu user={user} actions={[
									[ // Viewing / Downloading
										{
											textKey: "DownloadAll",
											icon: (p) => <DownloadIcon {...p} />,
											action: () => { console.error("Mark Played Missing.") },
										},
									],
									[ // User-based actions
										AddToFavoritesAction,
										MarkPlayedAction,
										AddToCollectionAction,
										AddToPlaylistAction,
									],
									[ // Server-based actions
										{
											textKey: "Edit",
											icon: (p) => <EditIcon {...p} />,
											visible: (u) => u.Policy?.IsAdministrator ?? false,
											action: () => { console.error("Edit Metadata Missing.") },
										},
										{
											textKey: "Identify",
											icon: (p) => <IdentifyIcon {...p} />,
											visible: (u) => u.Policy?.IsAdministrator ?? false,
											action: () => { console.error("Identify Missing.") },
										},
										{
											textKey: "Refresh",
											icon: (p) => <RefreshIcon {...p} />,
											visible: (u) => u.Policy?.IsAdministrator ?? false,
											action: () => { console.error("Refresh Metadata Missing.") },
										},
									]
								]} />
							</Layout>

							<ItemOverview item={show} />

							<Layout direction="row" gap={8}>
								<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: 4, py: 4 }} />
								<ItemTags
									item={show}
									direction="row" gap={8} wrap
									linkClassName={background.button}
									linkLayout={{ px: 4, py: 4 }}
								/>
							</Layout>
							{/* TODO: Airing/Aired Time */}
							{/* TODO: Review/Star Rating */}
							{/* TODO: Play */}
							{/* TODO: Shuffle */}
							{/* TODO: Next Up */}
							<CastAndCrew item={show} />

							<ListOf
								items={seasons}
								direction="column" gap={8}
								forEachItem={(season) => <SeasonForShow key={season.Id} season={season} />}
							/>
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
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
				whenNotStarted={<LoadingIcon size={48} />}
				whenLoading={<LoadingIcon size={48} />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(episodes) => (
					<>
						<Button type="button" onClick={() => setSeasonOpen(!seasonOpen)} direction="row" fontSize="1.5em" py={8} px={8} gap={8}>
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

const CastAndCrew: React.FC<{ item: BaseItemDto }> = (props) => {
	const [open, setOpen] = React.useState(false);
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(props.item.People) || props.item.People.length === 0 ) {
		return <></>;
	}

	return (
		<Layout direction="column" minWidth="100%">
			<Button type="button" label="HeaderCastAndCrew" onClick={() => setOpen(!open)} direction="row" fontSize="1.5em" py={8} px={8} gap={8} />

			<Collapsible open={open}>
				<ListOf
					className={background.panel}
					direction="row" wrap
					items={props.item.People ?? []}
					forEachItem={((person) => <CastAndCrewCredit key={"" + person.Id + person.Role} person={person} />)}
				/>
			</Collapsible>
		</Layout>
	);
};

const CastAndCrewCredit: React.FC<{ person: BaseItemPerson }> = (props) => {
	const itemsPerRow = useBreakpointValue({ [ResponsiveBreakpoint.Mobile]: 1, [ResponsiveBreakpoint.Tablet]: 3, [ResponsiveBreakpoint.Desktop]: 6 });

	return (
		<LinkToPerson id={props.person.Id} direction="column" width={{ itemsPerRow: itemsPerRow, gap: 0 }} px=".5em" py=".5em" gap=".25em">
			<Layout direction="row" fontSize="1em">{props.person.Name}</Layout>
			<Layout direction="row" fontSize=".8em">{props.person.Role}</Layout>
		</LinkToPerson>
	);
};
