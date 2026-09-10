import * as React from "react";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { useBreakpointValues } from "AppStyles";
import { ListOf } from "Common/ListOf";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { Settings } from "Users/SettingsStore";
import { ItemListService } from "ItemList/ItemListService";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortType } from "ItemList/ItemSortType";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Layout } from "Common/Layout";
import { TranslatedNumber, TranslatedText } from "Common/TranslatedText";
import { Button } from "Common/Button";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { useSelectModeActions } from "MenuActions/SelectModeActions";
import { ItemGroupByType } from "ItemList/ItemGroupByType";
import { GroupedItems, ItemGroupByTypeStore } from "ItemList/ItemGroupByTypeStore";

interface LoadedItemsViewProps {
	baseUrl: string;
	items: BaseItemDto[];
	listOptions: ItemListViewOptions;
	itemList: ItemListService;
	settings: Settings;
	filterTypes: ItemFilterType[];
	sortTypes: ItemSortType[];
	groupByTypes: ItemGroupByType[];
	additionalButtons?: React.ReactNode;
	reloadItems: () => void;
	user: UserDto;
	fallbackItem?: (item: BaseItemDto) => BaseItemDto;
	getContent?: (item: BaseItemDto) => string|undefined;
	menuActions?: ItemMenuAction[][];
}

export const ItemGridWithFilters: React.FC<LoadedItemsViewProps> = ({ baseUrl, itemList, items, listOptions, settings, filterTypes, sortTypes, groupByTypes, additionalButtons, fallbackItem, getContent, menuActions, user, reloadItems }) => {
	const sorts = useObservable(listOptions.SortBy);
	const itemsPerRow = useBreakpointValues(2, 4, 7, 9);
	const selectModeEnabled = useObservable(itemList.SelectModeEnabled);
	const selectedItems = useObservable(itemList.SelectedItems);
	const selectModeActions = useSelectModeActions(selectModeEnabled, itemList);
	const groupBy = useObservable(listOptions.GroupBy);
	const layout = useObservable(listOptions.ListLayout.Current);
	const filteredAndSortedItems = useComputed(() => {
		if (listOptions === null) {
			return items;
		}

		const filterFunc = listOptions.FilterFunc.Value;
		const sortFunc = listOptions.SortByFunc.Value;

		return items.filter(filterFunc).sort(sortFunc);
	}, [items, listOptions]);

	const groupedItems = useComputed(() => {
		if (groupBy === undefined) {
			return [];
		}

		const groupedItems = filteredAndSortedItems.groupBy(groupBy.GroupByType.FindKey);
		const sortFunc = ItemGroupByTypeStore.Instance.CreateSortFunc(groupBy.SortGroups.Current.Value);
		return Object.keys(groupedItems).map((gi) => ({ Label: gi, Items: groupedItems[gi], ItemsCount: groupedItems[gi].length }) as GroupedItems).sort(sortFunc);
	}, [groupBy, filteredAndSortedItems]);

	return (
		<>
			{selectModeEnabled && (
				<Layout direction="row" backgroundColor="AlternatePanel" bt br bb bl width="100%" alignItems="center" justifyContent="center" gap="1em" py=".25rem">
					<TranslatedText textKey="SelectModeEnabledMessage" textProps={[selectedItems.length.toString()]} />
					<Button type="button" onClick={() => itemList.ToggleSelectMode()} label="Disable" px=".25em" py=".25em" />
				</Layout>
			)}

			<ItemListFilters
				baseUrl={baseUrl}
				listOptions={listOptions}
				itemList={itemList}
				settings={settings}
				items={items}
				remaining={filteredAndSortedItems.length}
				filterTypes={filterTypes}
				sortTypes={sortTypes}
				groupByTypes={groupByTypes}
				layout={layout}
				additionalButtons={(
					<>
						{additionalButtons}
						<ItemActionsMenu
							filteredItems={filteredAndSortedItems}
							selectedItems={selectModeEnabled ? selectedItems : undefined}
							reloadItems={reloadItems}
							user={user}
							actions={[selectModeActions].concat(menuActions ?? [])}
						/>
					</>
				)}
			/>

			{groupBy === undefined ? (
				<ListOf
					items={filteredAndSortedItems}
					direction="row" wrap gap=".5em"
					forEachItem={(item, index) => (
						<ItemsGridItem
							key={item.Id ?? index.toString()}
							item={item}
							fallback={Nullable.Value(fallbackItem, undefined, (fallbackItemFunc) => fallbackItemFunc(item))}
							itemsPerRow={itemsPerRow}
							additionalFields={sorts}
							getContent={getContent}
							selectModeEnabled={selectModeEnabled}
							selectedItems={selectedItems}
							toggleSelectedItem={(item) => itemList.SelectedItems.toggle(item)}
							layout={layout}
						/>
					)}
				/>
			) : groupedItems.map((group) => (
				<Layout direction="column" gap=".25rem" key={group.Label}>
					<Layout direction="row" gap=".25rem">
						<Layout direction="row" children={group.Label} fontSizeREM={1.3} />
						<TranslatedNumber numberValue={group.ItemsCount} formatText={(t) => `(${t})`} />
					</Layout>

					<ListOf
						items={group.Items}
						direction="row" wrap gap=".5em"
						forEachItem={(item, index) => (
							<ItemsGridItem
								key={item.Id ?? index.toString()}
								item={item}
								fallback={Nullable.Value(fallbackItem, undefined, (fallbackItemFunc) => fallbackItemFunc(item))}
								itemsPerRow={itemsPerRow}
								additionalFields={sorts}
								getContent={getContent}
								selectModeEnabled={selectModeEnabled}
								selectedItems={selectedItems}
								toggleSelectedItem={(item) => itemList.SelectedItems.toggle(item)}
								layout={layout}
							/>
						)}
					/>
				</Layout>
			))}
		</>
	);
};
