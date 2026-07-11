import * as React from "react";
import { BaseItemDto, BaseItemKind, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemService } from "Items/ItemsService";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { useParams } from "react-router-dom";
import { Settings } from "Users/SettingsStore";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { ItemListService } from "ItemList/ItemListService";
import { ItemGridWithFilters } from "ItemList/ItemGridWithFilters";
import { PageTitle } from "Common/PageTitle";
import { useUrlToItem } from "Items/LinkToItem";
import { ManageLibraryAction } from "MenuActions/ManageLIbraryAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { DataSourceType } from "ItemList/ItemListViewOptions";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortType } from "ItemList/ItemSortType";

export const ItemListViewWithDataSource: React.FC<{ paramName: string; dataSource: DataSourceType; icon: React.ReactNode; filterTypes?: ItemFilterType[]; sortTypes?: ItemSortType[]; }> = ({ icon, paramName, dataSource,filterTypes, sortTypes }) => {
	const routeParams = useParams();
	const dataSourceKey = routeParams[paramName]!;
	const viewOptionsKey = routeParams.viewOptionsKey;

	const itemList = React.useMemo(() => ItemService.Instance.FindOrCreateListFromSource({ DataSource: dataSource, DataSourceKey: dataSourceKey }), [dataSource]);

	return (
		<PageWithNavigation icon={icon} content={(libraries, user, settings) => (
			<LoadedBasicItemListView
				libraryId={dataSourceKey}
				viewOptionsKey={viewOptionsKey}
				itemList={itemList}
				filterTypes={filterTypes}
				sortTypes={sortTypes}
				libraries={libraries}
				user={user}
				settings={settings}
			/>
		)} />
	);
};

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind }> = ({ paramName, itemKind }) => {
	const routeParams = useParams();
	const libraryId = routeParams[paramName]!;
	const viewOptionsKey = routeParams.viewOptionsKey;
	const itemKindService = BaseItemKindServiceFactory.FindOrThrow(itemKind);

	return (
		<PageWithNavigation icon={itemKind} content={(libraries, user, settings) => (
			<LoadedBasicItemListView
				key={libraryId}
				libraryId={libraryId}
				viewOptionsKey={viewOptionsKey}
				itemList={ItemService.Instance.FindOrCreateListFromLibrary(libraries.single(l => l.Id === libraryId))}
				filterTypes={itemKindService.filterOptions}
				sortTypes={itemKindService.sortOptions}
				libraries={libraries}
				user={user}
				settings={settings}
			/>
		)} />
	);
};

interface LoadedBasicItemListViewProps {
	libraryId: string;
	viewOptionsKey?: string;
	settings: Settings;
	itemList: ItemListService;
	libraries: BaseItemDto[];
	user: UserDto;
	filterTypes?: ItemFilterType[];
	sortTypes?: ItemSortType[];
}

const LoadedBasicItemListView: React.FC<LoadedBasicItemListViewProps> = ({ libraries, user, settings, libraryId, itemList, viewOptionsKey, filterTypes, sortTypes }) => {
	const listOptions = useObservable(itemList.ListOptions);
	const library = libraries.single((l) => l.Id === libraryId);
	const baseUrl = useUrlToItem(library);

	React.useEffect(() => itemList.LoadWithAbort(), [itemList, libraries]);
	React.useEffect(() => { itemList.LoadItemListViewOptionsOrNew(settings, viewOptionsKey, library.Name!); }, [settings, viewOptionsKey]);

	return (
		<Loading
			receivers={[itemList.List]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
			whenReceived={(items) => (
				<Layout direction="column" gap="1em" py="1em">
					<PageTitle text={library?.Name} suppressOnScreen />
					<ItemGridWithFilters
						baseUrl={baseUrl}
						items={items.List}
						itemList={itemList}
						listOptions={listOptions}
						settings={settings}
						filterTypes={filterTypes ?? []}
						sortTypes={sortTypes ?? []}
						fallbackItem={() => library}
						user={user}
						reloadItems={() => itemList.LoadWithAbort(undefined, true)}
						menuActions={[[
							ManageLibraryAction(libraryId),
							AddToCollectionAction,
							AddToPlaylistAction,
							PlayVideoAction,
							MarkPlayedAction,
							MarkUnplayedAction,
						]]}
					/>
				</Layout>
			)}
		/>
	);
};
