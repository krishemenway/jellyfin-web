import * as React from "react";
import { BaseItemDto, BaseItemKind, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { useParams } from "react-router-dom";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { ItemListService } from "ItemList/ItemListService";
import { ItemGridWithFilters } from "ItemList/ItemGridWithFilters";
import { UserViewStore } from "Users/UserViewStore";
import { PageTitle } from "Common/PageTitle";
import { ItemFilterService } from "Items/ItemFilterService";
import { ServerService } from "Servers/ServerService";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { ItemRefreshButton } from "Items/ItemRefreshButton";
import { useUrlToItem } from "Items/LinkToItem";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { ManageLibraryAction } from "MenuActions/ManageLIbraryAction";
import { LoginService } from "Users/LoginService";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { ArrowSelectIcon } from "CommonIcons/ArrowSelectIcon";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";

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
				receivers={[SettingsStore.Instance.ReceiverFor("usersettings"), UserViewStore.Instance.FindOrCreateForUser(userId), LoginService.Instance.User]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(settings, libraries, user) => (
					<LoadedBasicItemListView
						libraryId={libraryId} viewOptionsKey={viewOptionsKey} itemList={itemList} itemKindService={itemKindService}
						settings={settings} libraries={libraries} key={libraryId} user={user}
					/>
				)}
			/>
		</PageWithNavigation>
	);
};

interface LoadedBasicItemListViewProps {
	libraryId: string;
	viewOptionsKey?: string;
	settings: Settings;
	itemList: ItemListService;
	libraries: BaseItemDto[];
	itemKindService: BaseItemKindService;
	user: UserDto;
}

const LoadedBasicItemListView: React.FC<LoadedBasicItemListViewProps> = ({ libraryId, itemList, libraries, settings, viewOptionsKey, itemKindService, user }) => {
	const listOptions = useObservable(itemList.ListOptions);
	const library = libraries.single((l) => l.Id === libraryId);
	const baseUrl = useUrlToItem(library);
	const selectMode = useObservable(itemList.SelectModeEnabled);
	const selectedItems = useObservable(itemList.SelectedItems);
	const ToggleBulkSelectModeEnabledAction: ItemMenuAction = {
		icon: (p) => <ArrowSelectIcon {...p} />,
		textKey: "ButtonSelectView",
		action: () => { itemList.SelectModeEnabled.Value = !itemList.SelectModeEnabled.Value; },
	};

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
						filterTypes={itemKindService.filterOptions ?? []}
						sortTypes={itemKindService.sortOptions ?? []}
						additionalButtons={(
							<>
								<ItemRefreshButton item={library} />
								<ItemActionsMenu
									items={selectMode ? selectedItems : [library]}
									reloadItems={() => itemList.LoadWithAbort(undefined, true)}
									user={user}
									actions={[
										[
											ManageLibraryAction,
											ToggleBulkSelectModeEnabledAction,
											AddToCollectionAction,
											AddToPlaylistAction,
											PlayVideoAction,
											MarkPlayedAction,
											MarkUnplayedAction,
										],
									]}
								/>
							</>
						)}
					/>
				</Layout>
			)}
		/>
	);
};
