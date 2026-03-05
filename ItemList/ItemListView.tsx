import * as React from "react";
import { BaseItemDto, BaseItemKind, QueryFiltersLegacy, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { ResponsiveBreakpoint, useBreakpointValue } from "AppStyles";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { ImageShape } from "Items/ItemImage";
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

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind }> = (props) => {
	const routeParams = useParams();
	const userId = useObservable(ServerService.Instance.CurrentUserId);
	const libraryId = routeParams[props.paramName];
	const optionsName = routeParams.optionsName;

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon={props.itemKind}><NotFound /></PageWithNavigation>;
	}

	const itemList = ItemService.Instance.FindOrCreateItemList(libraryId, props.itemKind);

	React.useEffect(() => itemList.LoadWithAbort(), [itemList]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings(libraryId), [libraryId]);
	React.useEffect(() => ItemFilterService.Instance.LoadFiltersWithAbort([libraryId]), [libraryId]);
	React.useEffect(() => UserViewStore.Instance.LoadUserViewsWithAbort(userId), [userId]);

	return (
		<PageWithNavigation icon={props.itemKind}>
			<Loading
				receivers={[itemList.List, SettingsStore.Instance.Settings, LoginService.Instance.User, ItemFilterService.Instance.FindOrCreateFiltersReceiver([libraryId]), UserViewStore.Instance.FindOrCreateForUser(userId)]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenReceived={(items, settings, user, filters, libraries) => (
					<ItemsGrid
						libraryId={libraryId} optionsName={optionsName} itemList={itemList}
						items={items.List} settings={settings}
						user={user} libraries={libraries}
						itemKind={props.itemKind} filters={filters}
					/>
				)}
			/>
		</PageWithNavigation>
	);
};

const itemsPerRowConfig = { [ResponsiveBreakpoint.Desktop] : 7, [ResponsiveBreakpoint.Tablet]: 6, [ResponsiveBreakpoint.Mobile]: 2, [ResponsiveBreakpoint.Wide]: 9 };

const ItemsGrid: React.FC<{ libraryId: string, optionsName?: string; items: BaseItemDto[]; itemList: ItemListService; itemKind: BaseItemKind; settings: Settings; user: UserDto; libraries: BaseItemDto[]; filters: QueryFiltersLegacy }> = (props) => {
	const itemsPerRow = useBreakpointValue(itemsPerRowConfig);
	const itemKindService = BaseItemKindServiceFactory.FindOrNull(props.itemKind);
	const listOptions = useObservable(props.itemList.ListOptions);
	const library = Linq.Single(props.libraries, (l) => l.Id === props.libraryId);

	const filteredAndSortedItems = useComputed(() => {
		const items = props.items.filter((i) => i.Type === props.itemKind);
		const options = props.itemList.ListOptions.Value;

		if (options === null) {
			return items;
		}

		const filterFunc = options.FilterFunc.Value;
		const sortFunc = options.SortByFunc.Value;

		return items.filter(filterFunc).sort(sortFunc);
	});

	React.useEffect(() => { props.itemList.LoadItemListViewOptionsOrNew(props.libraryId, props.settings, itemKindService, props.optionsName); }, [props.settings, itemKindService, props.optionsName]);

	return (
		<Layout direction="column" gap="1em" py="1em">
			<PageTitle text={library?.Name} suppressOnScreen />
			{listOptions && <ItemListFilters library={library} user={props.user} listOptions={listOptions} filters={props.filters} itemList={props.itemList} settings={props.settings} />}

			<ListOf
				items={filteredAndSortedItems}
				direction="row" wrap gap=".5em"
				forEachItem={(item, index) => (
					<ItemsGridItem
						key={item.Id ?? index.toString()}
						item={item}
						shape={itemKindService?.primaryShape ?? ImageShape.Portrait}
						itemsPerRow={itemsPerRow}
					/>
				)}
			/>
		</Layout>
	);
};
