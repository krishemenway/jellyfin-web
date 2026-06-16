import * as React from "react";
import { BaseItemDto, BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { PageWithNavigation, PageIsLoading } from "NavigationBar/PageWithNavigation";
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
				receivers={[SettingsStore.Instance.ReceiverFor("usersettings"), UserViewStore.Instance.FindOrCreateForUser(userId)]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(settings, libraries) => (
					<LoadedBasicItemListView
						libraryId={libraryId} viewOptionsKey={viewOptionsKey} itemList={itemList} itemKindService={itemKindService}
						settings={settings} libraries={libraries} key={libraryId}
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
}

const LoadedBasicItemListView: React.FC<LoadedBasicItemListViewProps> = ({ libraryId, itemList, libraries, settings, viewOptionsKey, itemKindService }) => {
	const listOptions = useObservable(itemList.ListOptions);
	const library = Linq.Single(libraries, (l) => l.Id === libraryId);
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
						filterTypes={itemKindService.filterOptions ?? []}
						sortTypes={itemKindService.sortOptions ?? []}
						additionalButtons={(
							<>
								<ItemRefreshButton item={library} />
								<ManageLibraryButton libraryId={library.Id} px=".5em" py=".5em" />
							</>
						)}
					/>
				</Layout>
			)}
		/>
	);
};
