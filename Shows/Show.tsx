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
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { ItemTags } from "Items/ItemTags";
import { ItemRating } from "Items/ItemRating";
import { useBackgroundStyles, useBreakpointValues } from "AppStyles";
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
import { EditItemAction } from "MenuActions/EditItemAction";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { CastAndCrew } from "Items/CastAndCrew";
import { BackdropService } from "Common/BackdropService";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { VideoPlayerService } from "Videos/VideoPlayerService";
import { SortByIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { useObservable } from "@residualeffect/rereactor";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { AggregateItemDuration, ItemDuration } from "Items/ItemDuration";
import { EditableItemProps } from "Items/EditableItemProps";
import { NumberField, TextField } from "Common/TextField";
import { FieldLabel } from "Common/FieldLabel";
import { ItemPremiereDate } from "Items/ItemPremiereDate";
import { ChangeImageButton } from "Items/ChangeImageButton";

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
				whenReceived={(show, children, user) => !Nullable.StringHasValue(routeParams.episodeId)
					? <LoadedShow show={show} children={children} user={user} />
					: <LoadedEpisode show={show} children={children} user={user} seasonId={routeParams.seasonId} episodeId={routeParams.episodeId} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedShow: React.FC<{ show: BaseItemDto; children: BaseItemDto[]; user: UserDto; }> = ({ show, children, user }) => {
	const background = useBackgroundStyles();
	const leftPanelItemsPerRow = useBreakpointValues(1, 1, 3, 3);
	const editableItem = useEditableItem(show, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);
	const seasons = React.useMemo(() => children.filter((i) => i.Type === "Season").sort(sortSeasons), [children]);
	const allEpisodes = React.useMemo(() => children.filter((i) => i.Type === "Episode"), [children]);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(show), [show]);

	return (
		<Layout direction="row" gap="1em" py="1em">
			<Layout direction="column" maxWidth="20%" gap=".5em">
				<Layout direction="column">
					<Layout direction="column" position="relative">
						<ItemImage item={show} type="Primary" />
						<ItemRating item={show} position="absolute" bottom=".5em" right=".5em" libraryId={show.ParentId!} isEditing={isEditing} editableItem={editableItem} />
					</Layout>

					<ChangeImageButton item={show} imageType="Primary" onChanged={() => ItemService.Instance.FindOrCreateItemData(show.Id!).LoadItemWithAbort(true)} isEditing={isEditing} />
				</Layout>

				<ItemStudios
					item={show}
					direction="row" gap=".5em" wrap
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: { itemsPerRow: leftPanelItemsPerRow }, py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					showMoreLimit={3}
					editableItem={editableItem} isEditing={isEditing} libraryId={show.ParentId!}
				/>

				<ItemExternalLinks
					item={show}
					direction="row" gap=".5em" wrap
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: { itemsPerRow: leftPanelItemsPerRow }, py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					editableItem={editableItem} isEditing={isEditing}
				/>

				<ItemGenres
					item={show}
					direction="row" gap=".5em" wrap
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: { itemsPerRow: leftPanelItemsPerRow }, py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					showMoreLimit={4}
					editableItem={editableItem} isEditing={isEditing} libraryId={show.ParentId!}
				/>
			</Layout>

			<ShowDetails show={show} user={user} seasons={seasons} allEpisodes={allEpisodes} isEditing={isEditing} editableItem={editableItem} />
		</Layout>
	);
};

const LoadedEpisode: React.FC<{ show: BaseItemDto; children: BaseItemDto[]; user: UserDto; seasonId?: string; episodeId?: string; }> = ({ show, children, user, episodeId }) => {
	const background = useBackgroundStyles();
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);
	const allEpisodes = React.useMemo(() => children.filter((i) => i.Type === "Episode"), [children]);
	const selectedEpisode = Nullable.Value(episodeId, undefined, (e) => allEpisodes.find((i) => i.Id === e));

	if (!Nullable.HasValue(selectedEpisode)) {
		throw new Error("Missing");
	}

	const editableItem = useEditableItem(selectedEpisode, user);

	React.useEffect(() => BackdropService.Instance.SetWithDispose(selectedEpisode), [selectedEpisode]);

	return (
		<Layout direction="row" gap="1em" py="1em">
			<Layout direction="column" maxWidth="20%" gap=".5em">
				<Layout direction="column">
					<Layout direction="column" position="relative">
						<ItemImage item={selectedEpisode} type="Primary" />
						<ItemRating item={selectedEpisode} position="absolute" bottom=".5em" right=".5em" libraryId={selectedEpisode.ParentId!} isEditing={isEditing} editableItem={editableItem} />
					</Layout>

					<ChangeImageButton item={selectedEpisode} imageType="Primary" onChanged={() => ItemService.Instance.FindOrCreateItemData(selectedEpisode.Id!).LoadItemWithAbort(true)} isEditing={isEditing} />
				</Layout>

				<ItemStudios
					item={selectedEpisode}
					direction="row" gap=".5em" wrap
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					showMoreLimit={3}
					editableItem={editableItem} isEditing={isEditing} libraryId={show.ParentId!}
				/>

				<ItemExternalLinks
					item={selectedEpisode}
					direction="row" gap=".5em" wrap
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					editableItem={editableItem} isEditing={isEditing}
				/>

				<ItemGenres
					item={selectedEpisode}
					direction="row" gap=".5em" wrap
					linkClassName={background.button}
					linkLayout={{ direction: "column", width: "100%", py: ".5em", textAlign: "center", alignItems: "center", justifyContent: "center", grow: true }}
					showMoreLimit={4}
					editableItem={editableItem} isEditing={isEditing} libraryId={show.ParentId!}
				/>
			</Layout>

			{Nullable.Value(selectedEpisode, undefined, (episode) => <EpisodeDetails episode={episode} show={show} user={user} isEditing={isEditing} />)}
		</Layout>
	);
};

const ShowDetails: React.FC<{ show: BaseItemDto; seasons: BaseItemDto[]; user: UserDto; allEpisodes: BaseItemDto[] }&EditableItemProps> = ({ show, seasons, user, allEpisodes, isEditing, editableItem }) => {
	const background = useBackgroundStyles();

	return (
		<Layout direction="column" grow gap="1.5rem">
			<Layout direction="row" justifyContent="space-between" gap="1rem">
				<ItemPageTitle item={show} isEditing={isEditing} editableItem={editableItem} />
				<Layout direction="row" gap="1rem">
					{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
					{isEditing && <ItemRefreshButton item={show} />}
					{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(); }} />}

					<ItemActionsMenu items={[show]} user={user} actions={[
						[
							AddToFavoritesAction,
							MarkPlayedAction,
							AddToCollectionAction,
							AddToPlaylistAction,
							EditItemAction,
						]
					]} />
				</Layout>
			</Layout>

			<Layout direction="row" gap="1rem">
				<ItemPremiereDate item={show} isEditing={isEditing} editableItem={editableItem} />
				<AggregateItemDuration items={allEpisodes} />
			</Layout>

			<ItemOverview item={show} isEditing={isEditing} editableItem={editableItem} />

			<ItemTags
				item={show}
				isEditing={isEditing} editableItem={editableItem} libraryId={show.ParentId!}
				direction="row" gap=".5em" wrap
				linkClassName={background.button}
				linkLayout={{ px: ".25em", py: ".25em" }}
				showMoreLimit={25}
			/>

			<CastAndCrewSection item={show} editableItem={editableItem} isEditing={isEditing} startOpen={false} />

			<ListOf
				items={seasons}
				direction="column" gap=".5em"
				forEachItem={(season) => <SeasonForShow key={season.Id} season={season} allEpisodes={allEpisodes} />}
			/>
		</Layout>
	)
};

const EpisodeDetails: React.FC<{ episode: BaseItemDto; show: BaseItemDto; user: UserDto; }&EditableItemProps> = ({ episode, show, user, isEditing }) => {
	const editableEpisode = useEditableItem(episode, user);
	const background = useBackgroundStyles();
	return (
		<Layout direction="column" grow gap="1.5em">
			<Layout direction="column" gap=".5em">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={show} editableItem={undefined} isEditing={false} />
					<Layout direction="row" gap=".5em">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <ItemRefreshButton item={episode} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(); }} />}
						{!isEditing && <Button type="button" icon={<PlayIcon />} alignItems="center" px=".5em" py=".5em" onClick={() => VideoPlayerService.Instance.ClearAndPlay([episode])} />}
						<ItemActionsMenu items={[episode]} user={user} actions={[
							[
								PlayVideoAction,
								AddToFavoritesAction,
								MarkPlayedAction,
								AddToCollectionAction,
								AddToPlaylistAction,
								EditItemAction,
							]
						]} />
					</Layout>
				</Layout>
				<EpisodeTitle episode={episode} isEditing={isEditing} editableItem={editableEpisode} />
			</Layout>

			<Layout direction="row" gap="1rem">
				<ItemPremiereDate item={episode} isEditing={isEditing} editableItem={editableEpisode} />
				<ItemDuration item={episode} />
			</Layout>

			<ItemOverview item={episode} isEditing={isEditing} editableItem={editableEpisode} />

			<ItemTags
				item={episode}
				isEditing={isEditing} editableItem={editableEpisode} libraryId={show.ParentId!}
				direction="row" gap=".5em" wrap
				linkClassName={background.button}
				linkLayout={{ px: ".25em", py: ".25em" }}
				showMoreLimit={25}
			/>

			<CastAndCrewSection item={episode} isEditing={isEditing} editableItem={editableEpisode} startOpen />
		</Layout>
	);
};

const EpisodeTitle: React.FC<{ episode: BaseItemDto; }&EditableItemProps> = ({ editableItem, episode, isEditing }) => {
	if (isEditing && Nullable.HasValue(editableItem)) {
		return (
			<Layout direction="row" fontSizeREM={1.3} elementType="h2" gap=".5rem" alignItems="center">
				<FieldLabel field={editableItem.ParentIndexNumber} textKey="LabelSeasonNumber" />
				<NumberField field={editableItem.ParentIndexNumber} width="3rem" textAlign="center" />

				<FieldLabel field={editableItem.IndexNumber} textKey="LabelEpisodeNumber" />
				<NumberField field={editableItem.IndexNumber} width="3rem" textAlign="center" />

				<TextField field={editableItem.Name} grow px=".5em" py=".5em" />
			</Layout>
		);
	}

	return (
		<Layout direction="row" fontSizeREM={1.3} elementType="h2">{episode.SeasonName} <TranslatedText textKey="Episode" /> {episode.IndexNumber}&nbsp;&ndash;&nbsp;{episode.Name}</Layout>
	);
}

const SeasonForShow: React.FC<{ season: BaseItemDto; allEpisodes: BaseItemDto[]; }> = ({ season, allEpisodes }) => {
	const [seasonOpen, setSeasonOpen] = React.useState(season.IndexNumber === 1);

	if (!Nullable.HasValue(season.Id)) {
		return <></>;
	}

	const episodes = React.useMemo(() => allEpisodes.filter((e) => e.SeasonId === season.Id).sort(SortByIndexNumber.sortFunc), [season, allEpisodes]);

	return (
		<Layout direction="column" minWidth="100%">
			<Button type="button" onClick={() => setSeasonOpen(!seasonOpen)} direction="row" fontSizeREM={1.5} py=".5em" px=".5em" gap=".5em">
				<Layout direction="row">{season.Name}</Layout>
				<Layout direction="row"><ProductionYearRangeForEpisodes episodes={episodes} /></Layout>
			</Button>

			<Collapsible open={seasonOpen}>
				<EpisodesInSeason episodes={episodes} season={season} />
			</Collapsible>
		</Layout>
	);
};

interface EpisodesInSeasonProps {
	episodes: BaseItemDto[];
	season: BaseItemDto;
}

const EpisodesInSeason: React.FC<EpisodesInSeasonProps> = (props) => {
	const background = useBackgroundStyles();
	const itemsPerRow = useBreakpointValues(2, 3, 5, 7);

	return (
		<Layout direction="row" px=".5em" py=".5em" gap=".5em" wrap className={background.panel}>
			{props.episodes.map((item) => (
				<ItemsGridItem
					item={item} key={item.Id}
					itemsPerRow={itemsPerRow}
					shape={ImageShape.Landscape}
					fallback={props.season}
					getContent={(item) => `${item.IndexNumber}. ${item.Name}`}
				/>
			))}
		</Layout>
	);
};


const ProductionYearRangeForEpisodes: React.FC<{ episodes: BaseItemDto[] }> = (props) => {
	const allYears = React.useMemo(() => props.episodes.filter((e) => Nullable.HasValue(e.ProductionYear)).map((e) => e.ProductionYear), [props.episodes]);
	const earliest = React.useMemo(() => Linq.Min(allYears, (e) => e), [allYears]);
	const newest = React.useMemo(() => Linq.Max(allYears, (e) => e), [allYears]);

	return <>({earliest !== newest ? `${earliest} - ${newest}` : earliest})</>;
};

const CastAndCrewSection: React.FC<{ item: BaseItemDto; startOpen: boolean; }&EditableItemProps> = (props) => {
	const [open, setOpen] = React.useState(props.startOpen);
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(props.item.People) || props.item.People.length === 0 ) {
		return <></>;
	}

	return (
		<Layout direction="column" minWidth="100%">
			<Button type="button" label="HeaderCastAndCrew" onClick={() => setOpen(!open)} direction="row" fontSizeREM={1.5} py=".5em" px=".5em" gap=".5em" />

			<Collapsible open={open}>
				<CastAndCrew
					className={background.panel}
					itemWithPeople={props.item}
					direction="row" wrap
					linkProps={{ px: ".5em", py: ".5em", gap: ".25em" }}
					editableItem={props.editableItem}
					isEditing={props.isEditing}
				/>
			</Collapsible>
		</Layout>
	);
};

function sortSeasons(itemA: BaseItemDto, itemB: BaseItemDto): number {
    const a = itemA.IndexNumber ?? 0;
    const b = itemB.IndexNumber ?? 0;

    if (a === 0 && b === 0) {
        return (itemA.Name ?? '').localeCompare(itemB.Name ?? '');
    } else if (a === 0) {
        return 1;
    } else if (b === 0) {
        return -1;
    } else {
        return a - b;
    }
}
