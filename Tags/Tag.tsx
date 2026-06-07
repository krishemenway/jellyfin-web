import * as React from "react";
import { useParams } from "react-router-dom";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { PageWithNavigation, PageIsLoading } from "NavigationBar/PageWithNavigation";
import { TagIcon } from "Tags/TagIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { PageTitle } from "Common/PageTitle";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { useBreakpointValues } from "AppStyles";
import { ItemsGridItem } from "ItemList/ItemGridItem";
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
import { ItemSortOption } from "ItemList/ItemSortOption";
import { SortByName } from "ItemList/ItemSortTypes/SortByName";
import { SortByDatePlayed } from "ItemList/ItemSortTypes/SortByDatePlayed";
import { SortByDateCreated } from "ItemList/ItemSortTypes/SortByDateCreated";
import { SortByPlayCount } from "ItemList/ItemSortTypes/SortByPlayCount";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { SortByRandom } from "ItemList/ItemSortTypes/SortByRandom";
import { SortByRuntime } from "ItemList/ItemSortTypes/SortByRuntime";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { ItemListService } from "ItemList/ItemListService";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { LoginService } from "Users/LoginService";

export const Tag: React.FC = () => {
	const tag = useParams().tag;
	const viewOptionsKey = useParams().viewOptionsKey;

	if (!Nullable.HasValue(tag) || tag.length === 0) {
		return <PageWithNavigation icon={<TagIcon />}><NotFound /></PageWithNavigation>;
	}

	const listService = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "Tag", DataSourceKey: tag });

	React.useEffect(() => listService.LoadWithAbort([]), [tag]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings("usersettings"), []);

	return (
		<PageWithNavigation icon={<TagIcon />}>
			<Loading
				receivers={[SettingsStore.Instance.ReceiverFor("usersettings"), LoginService.Instance.User, listService.List, ]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(settings, user, items) => <TagListViewOptions tag={tag} viewOptionsKey={viewOptionsKey} items={items.List} listService={listService} settings={settings} user={user} />}
			/>
		</PageWithNavigation>
	);
};

const TagListViewOptions: React.FC<{ tag: string; viewOptionsKey?: string; items: BaseItemDto[]; listService: ItemListService; settings: Settings; user: UserDto; }> = ({ tag, listService, ...props }) => {
	const listOptions = useObservable(listService.ListOptions);

	React.useEffect(() => { listService.LoadItemListViewOptionsOrNew(props.settings, props.viewOptionsKey); }, [props.settings, props.viewOptionsKey]);
	
	return (
		<Layout direction="column" gap="1em" py="1em" height="100%">
			<PageTitle text={tag} />
			<ItemsViewWithOptions listService={listService} tag={tag} listOptions={listOptions} {...props} />
		</Layout>
	);
};

const TagFilterTypes: ItemFilterType[] = [
	FilterByName,
	FilterByProductionYear,
	FilterByStudio,
	FilterByGenre,
	FilterByHasEnded,
	FilterByHasPlayed,
	FilterByContinueWatching,
	FilterByIsFavorite,
];

const TagSortTypes: ItemSortOption[] = [
	SortByName,
	SortByDatePlayed,
	SortByDateCreated,
	SortByPlayCount,
	SortByPremiereDate,
	SortByRandom,
	SortByRuntime,
];

const ItemsViewWithOptions: React.FC<{ tag: string; items: BaseItemDto[]; listOptions: ItemListViewOptions; listService: ItemListService; settings: Settings; user: UserDto; }> = (props) => {
	const sorts = useObservable(props.listOptions.SortBy);
	const itemsPerRow = useBreakpointValues(2, 4, 7, 9);
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
				baseUrl={`/Tags/${props.tag}`}
				listOptions={props.listOptions}
				itemList={props.listService}
				settings={props.settings}
				items={props.items}
				remaining={filteredAndSortedItems.length}
				filterTypes={TagFilterTypes}
				sortTypes={TagSortTypes}
				additionalButtons={<></>}
			/>

			<ListOf
				items={filteredAndSortedItems}
				direction="row" wrap gap=".5em"
				forEachItem={(item, index) => (
					<ItemsGridItem
						key={item.Id ?? index.toString()}
						item={item}
						itemsPerRow={itemsPerRow}
						additionalFields={sorts}
					/>
				)}
			/>
		</>
	);
};
