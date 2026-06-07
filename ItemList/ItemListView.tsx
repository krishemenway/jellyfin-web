import * as React from "react";
import { BaseItemDto, BaseItemKind, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { useBreakpointValues } from "AppStyles";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { ItemService } from "Items/ItemsService";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { LoginService } from "Users/LoginService";
import { ItemListService } from "ItemList/ItemListService";
import { UserViewStore } from "Users/UserViewStore";
import { PageTitle } from "Common/PageTitle";
import { ItemFilterService } from "Items/ItemFilterService";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { ServerService } from "Servers/ServerService";
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { ManageLibraryButton } from "Servers/ManageLibraryButton";
import { useUrlToItem } from "Items/LinkToItem";

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind }> = ({ paramName, itemKind }) => {
	const routeParams = useParams();
	const userId = useObservable(ServerService.Instance.CurrentUserId);
	const libraryId = routeParams[paramName];
	const viewOptionsKey = routeParams.viewOptionsKey;
	const itemKindService = BaseItemKindServiceFactory.FindOrThrow(itemKind);

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon={itemKind}><NotFound /></PageWithNavigation>;
	}

	const itemList = React.useMemo(() => ItemService.Instance.FindOrCreateListFromLibrary(libraryId, itemKind), [libraryId]);

	React.useEffect(() => SettingsStore.Instance.LoadSettings("usersettings"), []);
	React.useEffect(() => ItemFilterService.Instance.LoadFiltersWithAbort([libraryId]), [libraryId]);

	return (
		<PageWithNavigation icon={itemKind}>
			<Loading
				receivers={[SettingsStore.Instance.ReceiverFor("usersettings"), LoginService.Instance.User, UserViewStore.Instance.FindOrCreateForUser(userId)]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenReceived={(settings, user, libraries) => (
					<LoadedBasicItemListView
						libraryId={libraryId} viewOptionsKey={viewOptionsKey} itemList={itemList} itemKindService={itemKindService}
						settings={settings} user={user} libraries={libraries} key={libraryId}
					/>
				)}
			/>
		</PageWithNavigation>
	);
};

const LoadedBasicItemListView: React.FC<{ libraryId: string; viewOptionsKey?: string; settings: Settings; user: UserDto; itemList: ItemListService; libraries: BaseItemDto[]; itemKindService: BaseItemKindService }> = ({ itemList, libraries, ...props }) => {
	const listOptions = useObservable(itemList.ListOptions);
	const library = Linq.Single(libraries, (l) => l.Id === props.libraryId);

	React.useEffect(() => itemList.LoadWithAbort(), [itemList, libraries]);
	React.useEffect(() => { itemList.LoadItemListViewOptionsOrNew(props.settings, props.viewOptionsKey); }, [props.settings, props.viewOptionsKey]);

	return (
		<Loading
			receivers={[itemList.List]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
			whenReceived={(items) => (
				<Layout direction="column" gap="1em" py="1em">
					<PageTitle text={library?.Name} suppressOnScreen />
					<LoadedItemsView items={items.List} itemList={itemList} listOptions={listOptions} library={library} {...props} />
				</Layout>
			)}
		/>
	);
};


const LoadedItemsView: React.FC<{ library: BaseItemDto; items: BaseItemDto[]; listOptions: ItemListViewOptions; itemList: ItemListService; itemKindService: BaseItemKindService; settings: Settings; user: UserDto; }> = (props) => {
	const sorts = useObservable(props.listOptions.SortBy);
	const itemsPerRow = useBreakpointValues(2, 4, 7, 9);
	const baseUrl = useUrlToItem(props.library);
	const filteredAndSortedItems = useComputed(() => {
		if (props.listOptions === null) {
			return props.items;
		}

		const filterFunc = props.listOptions.FilterFunc.Value;
		const sortFunc = props.listOptions.SortByFunc.Value;

		return props.items.filter(filterFunc).sort(sortFunc);
	}, [props.items, props.listOptions]);

	return (
		<>
			<ItemListFilters
				user={props.user}
				baseUrl={baseUrl}
				listOptions={props.listOptions}
				itemList={props.itemList}
				settings={props.settings}
				items={props.items}
				remaining={filteredAndSortedItems.length}
				filterTypes={props.itemKindService.filterOptions ?? []}
				sortTypes={props.itemKindService.sortOptions ?? []}
				additionalButtons={(
					<>
						<ItemRefreshButton item={props.library} />
						<ManageLibraryButton libraryId={props.library.Id} px=".5em" py=".5em" />
					</>
				)}
			/>

			<ListOf
				items={filteredAndSortedItems}
				direction="row" wrap gap=".5em"
				forEachItem={(item, index) => (
					<ItemsGridItem
						key={item.Id ?? index.toString()}
						item={item}
						fallback={props.library}
						itemsPerRow={itemsPerRow}
						additionalFields={sorts}
					/>
				)}
			/>
		</>
	);
};
