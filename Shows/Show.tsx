import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Layout } from "Common/Layout";
import { NotFound } from "Common/NotFound";
import { IconForItemType } from "Items/IconForItemType";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemService } from "Items/ItemsService";
import { ListOf } from "Common/ListOf";
import { ItemsRow } from "Items/ItemsRow";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ItemImage } from "Items/ItemImage";
import { Array, Nullable } from "Common/MissingJavascriptFunctions";
import { ItemTags } from "Items/ItemTags";
import { ItemRating } from "Items/ItemRating";
import { useBackgroundStyles } from "Common/AppStyles";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { ItemFavoriteIcon } from "Items/ItemFavoriteIcon";
import { Collapsible } from "Common/Collapsible";
import { Button } from "Common/Button";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { ItemStudios } from "Items/ItemStudios";
import { TranslatedText } from "Common/TranslatedText";

const SeasonForShow: React.FC<{ season: BaseItemDto }> = (props) => {
	const [seasonOpen, setSeasonOpen] = React.useState(props.season.IndexNumber === 1);

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(props.season.Id).LoadChildrenWithAbort(), [props.season]);

	return (
		<Layout direction="column" minWidth="100%">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(props.season.Id).Children]}
				whenNotStarted={<LoadingIcon size={48} />}
				whenLoading={<LoadingIcon size={48} />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(episodes) => (
					<>
						<Button type="button" onClick={() => setSeasonOpen(!seasonOpen)} direction="row" fontSize="22px" py={8} px={8} gap={8}>
							<Layout direction="row">{props.season.Name}</Layout>
							<Layout direction="row"><YearOrMonthRange episodes={episodes} /></Layout>
						</Button>

						<Collapsible open={seasonOpen}>
							<ItemsRow items={episodes} />
						</Collapsible>
					</>
				)}
			/>
		</Layout>
	);
};

const YearOrMonthRange: React.FC<{ episodes: BaseItemDto[] }> = (props) => {
	const allYears = React.useMemo(() => props.episodes.filter((e) => Nullable.HasValue(e.ProductionYear)).map((e) => e.ProductionYear), [props.episodes]);
	const earliest = React.useMemo(() => Array.Min(allYears, (e) => e), [allYears]);
	const newest = React.useMemo(() => Array.Max(allYears, (e) => e), [allYears]);

	return <>({earliest !== newest ? `${earliest} - ${newest}` : earliest})</>;
};

export const Show: React.FC = () => {
	const background = useBackgroundStyles();
	const routeParams = useParams<{ showId: string; seasonId?: string; episodeId?: string }>();

	if (routeParams.showId === undefined) {
		return <NotFound />;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.showId).LoadItemWithAbort(), [routeParams.showId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.showId).LoadChildrenWithAbort(), [routeParams.showId]);

	return (
		<PageWithNavigation icon={<IconForItemType itemType="Movie" size={24} />}>
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.showId).Item, ItemService.Instance.FindOrCreateItemData(routeParams.showId).Children]}
				whenNotStarted={<LoadingIcon size={48} />}
				whenLoading={<LoadingIcon size={48} />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(show, seasons) => (
					<Layout direction="row" gap={16} py={16}>
						<Layout direction="column" maxWidth="20%" gap={8}>
							<Layout direction="column" position="relative">
								<ItemImage item={show} type="Primary" />
								<ItemRating item={show} position="absolute" bottom={8} right={8} />
							</Layout>

							<ItemStudios
								item={show}
								linkClassName={background.button}
								linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center"}}
								listLayout={{ direction: "row", gap: 8 }}
								listItemLayout={{ direction: "row", grow: 1 }}
							/>

							<ItemExternalLinks
								item={show}
								linkClassName={background.button}
								linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center"}}
								listLayout={{ direction: "row", gap: 8 }}
								listItemLayout={{ direction: "row", grow: 1 }}
							/>

							<ItemGenres
								item={show}
								linkClassName={background.button}
								linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center"}}
								listLayout={{ direction: "row", gap: 8 }}
								listItemLayout={{ direction: "row", grow: 1 }}
							/>
						</Layout>

						<Layout direction="column" maxWidth="calc(80% - 16px)" gap={32}>
							<Layout direction="row" fontSize="32px" justifyContent="space-between">
								<Layout direction="row" className="show-name">{show.Name}</Layout>
								<ItemActionsMenu actions={[[
									{
										textKey: "AddToFavorites",
										action: () => { console.log("Add To Favorites.") },
										icon: <ItemFavoriteIcon size={24} />,
									},
									// TODO: Mark Watched
									// TODO: Add to Collection
									// TODO: Add to Playlist
									// TODO: Download All
									// TODO: Delete Series
									// TODO: Edit Metadata
									// TODO: Edit Images
									// TODO: Identify
									// TODO: Refresh Metadata
								]]} />
							</Layout>

							<Layout direction="row" fontSize="12px" className="show-overview">{show.Overview}</Layout>

							<Layout direction="row" gap={8}>
								<TranslatedText textKey="Tags" formatText={(t) => `${t}:`} elementType="div" layout={{ px: 4, py: 4 }} />
								<ItemTags
									item={show}
									listLayout={{ direction: "row", gap: 8, wrap: true }}
									linkClassName={background.button}
									linkLayout={{ px: 4, py: 4 }}
								/>
							</Layout>
							{/* TODO: Airing/Aired Time */}
							{/* TODO: Review/Star Rating */}
							{/* TODO: Play */}
							{/* TODO: Shuffle */}
							{/* TODO: Next Up */}
							<ListOf
								items={seasons}
								createKey={(season, index) => season.Id ?? index.toString()}
								listLayout={{ direction: "column", gap: 8 }}
								renderItem={(season) => <SeasonForShow season={season} />}
							/>
							{/* TODO: Cast & Crew */}
							{/* TODO: More like this */}
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};
