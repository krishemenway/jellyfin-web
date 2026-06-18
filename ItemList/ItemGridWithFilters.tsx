import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { useBackgroundStyles, useBreakpointValues } from "AppStyles";
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
import { TranslatedText } from "Common/TranslatedText";
import { Button } from "Common/Button";

interface LoadedItemsViewProps {
	baseUrl: string;
	items: BaseItemDto[];
	listOptions: ItemListViewOptions;
	itemList: ItemListService;
	settings: Settings;
	filterTypes: ItemFilterType[];
	sortTypes: ItemSortType[];
	additionalButtons?: React.ReactNode;
	fallbackItem?: (item: BaseItemDto) => BaseItemDto;
	getContent?: (item: BaseItemDto) => string|undefined;
}

export const ItemGridWithFilters: React.FC<LoadedItemsViewProps> = ({ baseUrl, itemList, items, listOptions, settings, filterTypes, sortTypes, additionalButtons, fallbackItem, getContent }) => {
	const background = useBackgroundStyles();
	const sorts = useObservable(listOptions.SortBy);
	const itemsPerRow = useBreakpointValues(2, 4, 7, 9);
	const selectModeEnabled = useObservable(itemList.SelectModeEnabled);
	const selectedItems = useObservable(itemList.SelectedItems);
	const filteredAndSortedItems = useComputed(() => {
		if (listOptions === null) {
			return items;
		}

		const filterFunc = listOptions.FilterFunc.Value;
		const sortFunc = listOptions.SortByFunc.Value;

		return items.filter(filterFunc).sort(sortFunc);
	}, [items, listOptions]);

	return (
		<>
			{selectModeEnabled && (
				<Layout direction="row" className={background.alternatePanel} width="100%" alignItems="center" justifyContent="center" gap="1em" py=".25rem">
					<TranslatedText textKey="SelectModeEnabledMessage" />
					<Button type="button" onClick={() => { itemList.SelectModeEnabled.Value = false; }} label="Disable" px=".25em" py=".25em" />
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
				additionalButtons={additionalButtons}
			/>

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
					/>
				)}
			/>
		</>
	);
};
