import * as React from "react";
import { useParams } from "react-router-dom";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { TagIcon } from "Tags/TagIcon";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { PageTitle } from "Common/PageTitle";
import { Layout } from "Common/Layout";
import { ItemService } from "Items/ItemsService";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { FilterByName } from "ItemList/ItemFilterTypes/FilterByName";
import { FilterByProductionYear } from "ItemList/ItemFilterTypes/FilterByProductionYear";
import { FilterByStudio } from "ItemList/ItemFilterTypes/FilterByStudio";
import { FilterByGenre } from "ItemList/ItemFilterTypes/FilterByGenre";
import { FilterByHasEnded } from "ItemList/ItemFilterTypes/FilterByHasEnded";
import { FilterByHasPlayed } from "ItemList/ItemFilterTypes/FilterByHasPlayed";
import { FilterByIsFavorite } from "ItemList/ItemFilterTypes/FilterByIsFavorite";
import { FilterByType } from "ItemList/ItemFilterTypes/FilterByType";
import { FilterByTag } from "ItemList/ItemFilterTypes/FilterByTag";
import { ItemSortType } from "ItemList/ItemSortType";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByPlayCount } from "ItemList/ItemSortTypes/SortByPlayCount";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";
import { useObservable } from "@residualeffect/rereactor";
import { ItemListService } from "ItemList/ItemListService";
import { Settings } from "Users/SettingsStore";
import { ItemGridWithFilters } from "ItemList/ItemGridWithFilters";
import { BaseItemKindServiceFactory, defaultNameFunc } from "Items/BaseItemKindServiceFactory";
import { ContinuingSorts } from "ItemList/ItemListViewOptions";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";

export const ResumeView: React.FC = () => {
	const viewOptionsKey = useParams().viewOptionsKey;
	const itemList = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "Resume", DataSourceKey: "Resume" });

	React.useEffect(() => itemList.LoadWithAbort([]), []);

	return (
		<PageWithNavigation icon={<TagIcon />} content={(_, user, settings) => (
			<Loading
				receivers={[itemList.List]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(items) => <ListViewOptions viewOptionsKey={viewOptionsKey} items={items.List} itemList={itemList} settings={settings} user={user} />}
			/>
		)} />
	);
};

const FilterTypes: ItemFilterType[] = [
	FilterByName,
	FilterByProductionYear,
	FilterByStudio,
	FilterByGenre,
	FilterByHasEnded,
	FilterByHasPlayed,
	FilterByIsFavorite,
	FilterByType,
	FilterByTag,
];

const SortTypes: ItemSortType[] = [
	SortByName,
	SortByDatePlayed,
	SortByDateCreated,
	SortByPlayCount,
	SortByPremiereDate,
	SortByRandom,
	SortByRuntime,
];

const ListViewOptions: React.FC<{ viewOptionsKey?: string; items: BaseItemDto[]; itemList: ItemListService; settings: Settings; user: UserDto }> = ({ viewOptionsKey, items, itemList, settings, user }) => {
	const listOptions = useObservable(itemList.ListOptions);

	React.useEffect(() => itemList.LoadItemListViewOptionsOrNew(settings, viewOptionsKey, "Resume", { Sorts: ContinuingSorts }), [settings, viewOptionsKey]);
	
	return (
		<Layout direction="column" gap="1em" py="1em" height="100%">
			<PageTitle text={{ Key: "ContinueWatching" }} />
			<ItemGridWithFilters
				items={items}
				settings={settings}
				baseUrl="/Resume"
				itemList={itemList}
				listOptions={listOptions}
				filterTypes={FilterTypes}
				sortTypes={SortTypes}
				getContent={(i) => (BaseItemKindServiceFactory.FindOrThrow(i.Type).nameWithContext ?? defaultNameFunc)(i)}
				reloadItems={() => itemList.LoadWithAbort([], true)}
				user={user}
				menuActions={[
					[
						AddToCollectionAction,
						AddToPlaylistAction,
						PlayVideoAction,
						MarkPlayedAction,
						MarkUnplayedAction,
					],
				]}
			/>
		</Layout>
	);
};
