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
import { FilterByContinueWatching } from "ItemList/ItemFilterTypes/FilterByContinueWatching";
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
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
import { ArrowSelectIcon } from "CommonIcons/ArrowSelectIcon";
import { ItemMenuAction } from "Items/ItemMenuAction";

export const Tag: React.FC = () => {
	const tag = useParams().tag!;
	const viewOptionsKey = useParams().viewOptionsKey;

	const itemList = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "Tag", DataSourceKey: tag });
	React.useEffect(() => itemList.LoadWithAbort([]), [tag]);

	return (
		<PageWithNavigation icon={<TagIcon />} content={(_, user, settings) => (
			<Loading
				receivers={[itemList.List]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(items) => <TagListViewOptions tag={tag} viewOptionsKey={viewOptionsKey} items={items.List} itemList={itemList} settings={settings} user={user} />}
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
	FilterByContinueWatching,
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

interface TagListViewOptionsProps {
	tag: string;
	viewOptionsKey?: string;
	items: BaseItemDto[];
	itemList: ItemListService;
	settings: Settings;
	user: UserDto;
}

const TagListViewOptions: React.FC<TagListViewOptionsProps> = ({ tag, viewOptionsKey, items, itemList, settings, user }) => {
	const listOptions = useObservable(itemList.ListOptions);
	const selectModeEnabled = useObservable(itemList.SelectModeEnabled);
	const selectedItems = useObservable(itemList.SelectedItems);
	const ToggleBulkSelectModeEnabledAction: ItemMenuAction = {
		icon: (p) => <ArrowSelectIcon {...p} />,
		textKey: "ButtonSelectView",
		action: () => { itemList.SelectModeEnabled.Value = !itemList.SelectModeEnabled.Value; },
	};
	

	React.useEffect(() => { itemList.LoadItemListViewOptionsOrNew(settings, viewOptionsKey, tag); }, [settings, viewOptionsKey]);
	
	return (
		<Layout direction="column" gap="1em" py="1em" height="100%">
			<PageTitle text={tag} />
			<ItemGridWithFilters
				items={items}
				settings={settings}
				baseUrl={`/Tags/${tag}`}
				itemList={itemList}
				listOptions={listOptions}
				filterTypes={FilterTypes}
				sortTypes={SortTypes}
				getContent={(i) => (BaseItemKindServiceFactory.FindOrThrow(i.Type).nameWithContext ?? defaultNameFunc)(i)}
				additionalButtons={(
					<ItemActionsMenu
						items={selectModeEnabled ? selectedItems : []}
						reloadItems={() => itemList.LoadWithAbort([], true)}
						user={user}
						actions={[
							[
								ToggleBulkSelectModeEnabledAction,
								AddToCollectionAction,
								AddToPlaylistAction,
								PlayVideoAction,
								MarkPlayedAction,
								MarkUnplayedAction,
							],
						]}
					/>
				)}
			/>
		</Layout>
	);
};
