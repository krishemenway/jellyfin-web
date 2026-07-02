import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout } from "Common/Layout";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { ItemImage } from "Items/ItemImage";
import { ChangeImageButton } from "Items/ChangeImageButton";
import { useObservable } from "node_modules/@residualeffect/rereactor/lib";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { Button } from "Common/Button";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { PlayVideoAction } from "MenuActions/PlayVideoAction";
import { AddToFavoritesAction, RemoveFromFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { MarkPlayedAction, MarkUnplayedAction } from "MenuActions/MarkPlayedAction";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { AddToPlaylistAction } from "MenuActions/AddToPlaylistAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { BaseItemDto, UserDto } from "node_modules/@jellyfin/sdk/lib/generated-client";
import { ItemGridWithFilters } from "ItemList/ItemGridWithFilters";
import { Settings } from "Users/SettingsStore";
import { ItemListService } from "ItemList/ItemListService";
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
import { BaseItemKindServiceFactory, defaultNameFunc } from "Items/BaseItemKindServiceFactory";

export const Collection: React.FC = () => {
	const collectionId = useParams().collectionId!;
	const viewOptionsKey = useParams().viewOptionsKey;

	const collectionService = ItemService.Instance.FindOrCreateItemData(collectionId);
	const itemList = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "Collection", DataSourceKey: collectionId });

	React.useEffect(() => collectionService.LoadItemWithAbort(), [collectionService]);
	React.useEffect(() => itemList.LoadWithAbort([]), [collectionId]);

	return (
		<PageWithNavigation icon="BoxSet" content={(_, user, settings) => (
			<Loading
				receivers={[collectionService.Item, itemList.List]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(collection, collectionItems) => <LoadedCollection itemList={itemList} viewOptionsKey={viewOptionsKey} settings={settings} collection={collection} collectionItems={collectionItems.List} user={user} reload={() => collectionService.LoadItemWithAbort(true)} />}
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

const LoadedCollection: React.FC<{ collection: BaseItemDto; itemList: ItemListService; collectionItems: BaseItemDto[]; user: UserDto; reload: () => void; settings: Settings; viewOptionsKey?: string; }> = ({ collection, itemList, collectionItems, user, reload: reloadCollection, settings, viewOptionsKey }) => {
	const listOptions = useObservable(itemList.ListOptions);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);
	const editableItem = useEditableItem(collection, user);

	React.useEffect(() => { itemList.LoadItemListViewOptionsOrNew(settings, viewOptionsKey, collection.Name!); }, [settings, viewOptionsKey]);

	return (
		<Layout direction="column" gap="1em" py="1rem">
			<Layout direction="column" gap=".5rem" alignItems="center">
				<ItemPageTitle item={collection} editableItem={editableItem} isEditing={isEditing} />
				<ItemImage item={collection} type="Primary" bb bl br bt maxWidth="40rem" />
				<ChangeImageButton item={collection} imageType="Primary" label="ButtonChangeImage" onChanged={() => reloadCollection()} isEditing={isEditing} />
				<ChangeImageButton item={collection} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => reloadCollection()} isEditing={isEditing} />
			</Layout>

			<ItemGridWithFilters
				items={collectionItems}
				settings={settings}
				baseUrl={`/Collection/${collection.Id}`}
				itemList={itemList}
				listOptions={listOptions}
				filterTypes={FilterTypes}
				sortTypes={SortTypes}
				getContent={(i) => (BaseItemKindServiceFactory.FindOrThrow(i.Type).nameWithContext ?? defaultNameFunc)(i)}
				reloadItems={() => itemList.LoadWithAbort([], true)}
				user={user}
				menuActions={[[
					EditItemAction,
					AddToCollectionAction,
					AddToPlaylistAction,
					PlayVideoAction,
					AddToFavoritesAction,
					RemoveFromFavoritesAction,
					MarkPlayedAction,
					MarkUnplayedAction,
				]]}
				additionalButtons={(
					<>
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadCollection); }} />}
					</>
				)}
			/>
		</Layout>
	);
};
