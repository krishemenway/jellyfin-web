import * as React from "react";
import { useParams } from "react-router-dom";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { PageWithNavigation, PageIsLoading } from "NavigationBar/PageWithNavigation";
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
import { Settings, SettingsStore } from "Users/SettingsStore";
import { ItemGridWithFilters } from "ItemList/ItemGridWithFilters";
import { BaseItemKindServiceFactory, defaultNameFunc } from "Items/BaseItemKindServiceFactory";

export const ResumeView: React.FC = () => {
	const viewOptionsKey = useParams().viewOptionsKey;
	const itemList = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "Resume", DataSourceKey: "Resume" });

	React.useEffect(() => itemList.LoadWithAbort([]), []);
	React.useEffect(() => SettingsStore.Instance.LoadSettings("usersettings"), []);

	return (
		<PageWithNavigation icon={<TagIcon />}>
			<Loading
				receivers={[SettingsStore.Instance.ReceiverFor("usersettings"), itemList.List]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(settings, items) => <ListViewOptions viewOptionsKey={viewOptionsKey} items={items.List} itemList={itemList} settings={settings} />}
			/>
		</PageWithNavigation>
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

const ListViewOptions: React.FC<{ viewOptionsKey?: string; items: BaseItemDto[]; itemList: ItemListService; settings: Settings; }> = ({ viewOptionsKey, items, itemList, settings }) => {
	const listOptions = useObservable(itemList.ListOptions);

	React.useEffect(() => { itemList.LoadItemListViewOptionsOrNew(settings, viewOptionsKey, "Resume"); }, [settings, viewOptionsKey]);
	
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
			/>
		</Layout>
	);
};
