import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import Layout from "Common/Layout";
import NotFound from "Common/NotFound";
import IconForItemType from "Items/IconForItemType";
import { Loading } from "Common/Loading";
import LoadingSpinner from "Common/LoadingSpinner";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import { ItemService } from "Items/ItemsService";
import ListOf from "Common/ListOf";
import ItemsRow from "Items/ItemsRow";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import ItemImage from "Items/ItemImage";
import { ArrayMax, ArrayMin } from "Common/Array";
import ItemTags from "Items/ItemTags";
import ItemExternalLinks from "Items/ItemExternalLinks";
import ItemGenres from "Items/ItemGenres";
import ItemRating from "Items/ItemRating";
import ItemStudios from "Items/ItemStudios";

const Show: React.FC = () => {
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
				whenNotStarted={<LoadingSpinner />}
				whenLoading={<LoadingSpinner />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(show, seasons) => (
					<Layout direction="row" gap={16} py={16}>
						<Layout direction="column" maxWidth="20%" position="relative">
							<ItemImage item={show} type="Primary" />
							<ItemStudios item={show} />
							<ItemRating item={show} position="absolute" top={8} right={8} />
						</Layout>
						<Layout direction="column" maxWidth="calc(80% - 16px)" gap={32}>
							<Layout direction="row" fontSize="32px" gap={16} className="show-name">{show.Name}</Layout>
							<Layout direction="row" fontSize="12px" className="show-overview">{show.Overview}</Layout>
							<ItemTags item={show} />
							<ItemExternalLinks item={show} />
							<ItemGenres item={show} />
							{/* TODO: Airing/Aired Time */}
							{/* TODO: Studio */}
							{/* TODO: Review/Star Rating */}
							{/* TODO: Play */}
							{/* TODO: Shuffle */}
							{/* TODO: Mark Watched */}
							{/* TODO: Mark Favorite */}
							{/* TODO: Add to Collection */}
							{/* TODO: Add to Playlist */}
							{/* TODO: Download All */}
							{/* TODO: Delete Series */}
							{/* TODO: Edit Metadata */}
							{/* TODO: Edit Images */}
							{/* TODO: Identify */}
							{/* TODO: Refresh Metadata */}
							{/* TODO: Next Up */}
							{/* TODO: Cast & Crew */}
							{/* TODO: More like this */}
							<ListOf
								items={seasons}
								createKey={(season, index) => season.Id ?? index.toString()}
								listLayout={{ direction: "column", gap: 24 }}
								renderItem={(season) => <SeasonForShow season={season} />}
							/>
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};

const SeasonForShow: React.FC<{ season: BaseItemDto }> = (props) => {
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(props.season.Id).LoadChildrenWithAbort(), [props.season]);

	return (
		<Layout direction="column" minWidth="100%">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(props.season.Id).Children]}
				whenNotStarted={<LoadingSpinner />}
				whenLoading={<LoadingSpinner />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(episodes) => (
					<>
						<Layout direction="row" fontSize="22px" my={8} gap={8}>
							<Layout direction="row">{props.season.Name}</Layout>
							<Layout direction="row"><YearOrMonthRange episodes={episodes} /></Layout>
						</Layout>
						<ItemsRow items={episodes} />
					</>
				)}
			/>
		</Layout>
	);
};

const YearOrMonthRange: React.FC<{ episodes: BaseItemDto[] }> = (props) => {
	const allYears = React.useMemo(() => props.episodes.map((e) => e.ProductionYear), [props.episodes]);
	const earliest = React.useMemo(() => ArrayMin(allYears, (e) => e), [allYears]);
	const newest = React.useMemo(() => ArrayMax(allYears, (e) => e), [allYears]);

	return <>({earliest !== newest ? `${earliest} - ${newest}` : earliest})</>;
};

export default Show;
