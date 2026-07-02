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
import { Settings } from "Users/SettingsStore";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { ItemListService } from "ItemList/ItemListService";
import { ItemGridWithFilters } from "ItemList/ItemGridWithFilters";
import { PageTitle } from "Common/PageTitle";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { useUrlToItem } from "Items/LinkToItem";
import { ManageLibraryAction } from "MenuActions/ManageLIbraryAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind }> = ({ paramName, itemKind }) => {
	const routeParams = useParams();
	const libraryId = routeParams[paramName];
	const viewOptionsKey = routeParams.viewOptionsKey;
	const itemKindService = BaseItemKindServiceFactory.FindOrThrow(itemKind);

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon={itemKind} content={() => <NotFound />} />;
	}

	const itemList = React.useMemo(() => ItemService.Instance.FindOrCreateListFromLibrary(libraryId, itemKind), [libraryId]);

	return (
		<PageWithNavigation icon={itemKind} content={(libraries, user, settings) => (
			<LoadedBasicItemListView
				key={libraryId}
				libraryId={libraryId}
				viewOptionsKey={viewOptionsKey}
				itemList={itemList}
				itemKindService={itemKindService}
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
	itemKindService: BaseItemKindService;
	user: UserDto;
}

const LoadedBasicItemListView: React.FC<LoadedBasicItemListViewProps> = ({ libraries, user, settings, libraryId, itemList, viewOptionsKey, itemKindService }) => {
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
						filterTypes={itemKindService.filterOptions ?? []}
						sortTypes={itemKindService.sortOptions ?? []}
						user={user}
						reloadItems={() => itemList.LoadWithAbort(undefined, true)}
						menuActions={[[
							ManageLibraryAction,
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
