import * as React from "react";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { ItemListService } from "ItemList/ItemListService";
import { CenteredModal } from "Common/Modal";
import { AddIcon } from "Common/AddIcon";
import { useObservable } from "@residualeffect/rereactor";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { DeleteIcon } from "Common/DeleteIcon";
import { useBackgroundStyles } from "Common/AppStyles";
import { ArrowDownIcon } from "Common/ArrowDownIcon";
import { ArrowUpIcon } from "Common/ArrowUpIcon";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { ItemFilterValue } from "ItemList/ItemFilterValue";

export interface ItemListFiltersProps {
	itemId: string;
	service: ItemListService;
	filterOptions: ItemFilterType[];
	sortOptions: ItemSortOption[];
}

export const ItemListFilters: React.FC<ItemListFiltersProps> = (props) => {
	const background = useBackgroundStyles();

	const [addFilterOpen, setAddFilterOpen] = React.useState(false);
	const [addSortOpen, setAddSortOpen] = React.useState(false);
	const currentFilter = useObservable(props.service.Filter);
	const sorts = useObservable(currentFilter.SortBy);
	const filters = useObservable(currentFilter.Filters);
	const newFilter = useObservable(currentFilter.NewFilter);
	const stopEditingNewFilter = () => currentFilter.NewFilter.Value = undefined;

	return (
		<>
			<Layout direction="row" gap={16}>
				<Layout direction="row" gap={8} alignItems="center">
					<TranslatedText textKey="Filters" elementType="div" formatText={(t) => `${t}:`} />
					<Button px={8} py={4} type="button" onClick={() => setAddFilterOpen(true)}><AddIcon size={16} /></Button>
					<ListOf
						items={filters}
						direction="row" gap={8}
						forEachItem={(filter) => (
							<Layout direction="row" gap={8} className={background.alternatePanel} px={8} py={4}>
								<TranslatedText textKey={filter.FilterType.labelKey} elementType="div" />
								<Button type="button" onClick={() => currentFilter.Filters.remove(filter)}><DeleteIcon size={16} /></Button>
							</Layout>
						)}
					/>
				</Layout>

				<Layout direction="row" gap={8} alignItems="center">
					<TranslatedText textKey="HeaderSortBy" elementType="div" formatText={(t) => `${t}:`} />
					<Button px={8} py={4} type="button" onClick={() => setAddSortOpen(true)}><AddIcon size={16} /></Button>
					<ListOf
						items={sorts}
						direction="row" gap={8}
						forEachItem={(sort) => (
							<Layout direction="row" gap={8} className={background.alternatePanel} px={8} py={4}>
								{sort.Reversed ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
								<TranslatedText textKey={sort.LabelKey} elementType="div" />
								<Button type="button" onClick={() => currentFilter.SortBy.remove(sort)}><DeleteIcon size={16} /></Button>
							</Layout>
						)}
					/>
				</Layout>
			</Layout>

			<CenteredModal open={addFilterOpen} onClosed={() => setAddFilterOpen(false)}>
				<PickFilterModal filterOptions={props.filterOptions} onPicked={(option) => props.service.CreateNewFilter(option)} onClosed={() => setAddFilterOpen(false)} />
			</CenteredModal>

			<CenteredModal open={newFilter !== undefined} onClosed={stopEditingNewFilter}>
				{newFilter && <ConfigureFilterModal newFilter={newFilter} onClosed={stopEditingNewFilter} />}
			</CenteredModal>

			<CenteredModal open={addSortOpen} onClosed={() => setAddSortOpen(false)} maxWidth="20%">
				<PickSortOptionModal sortOptions={props.sortOptions} onPicked={(option, reversed) => currentFilter.AddSort(option, reversed)} onClosed={() => setAddSortOpen(false)} />
			</CenteredModal>
		</>
	);
};

const PickSortOptionModal: React.FC<{ sortOptions: ItemSortOption[]; onPicked: (option: ItemSortOption, reversed: boolean) => void; onClosed: () => void; }> = (props) => {
	return (
		<ListOf
			items={props.sortOptions}
			direction="row" wrap
			px={16} py={16} gap={16} grow
			forEachItem={(sortOption) => (
				<Layout key={sortOption.labelKey} direction="column" basis="0px" grow minWidth="20%" maxWidth="33%" justifyContent="space-between" textAlign="center" gap="1em">
					<TranslatedText textKey={sortOption.labelKey}  />
					<Layout direction="row" justifyContent="center" alignItems="center">
						<Button type="button" grow justifyContent="center" onClick={() => { props.onPicked(sortOption, false); props.onClosed(); }}><ArrowUpIcon size={16} /></Button>
						<Button type="button" grow justifyContent="center" onClick={() => { props.onPicked(sortOption, true); props.onClosed(); }}><ArrowDownIcon size={16} /></Button>
					</Layout>
				</Layout>
			)}
		/>
	);
};

const PickFilterModal: React.FC<{ filterOptions: ItemFilterType[]; onPicked: (option: ItemFilterType) => void; onClosed: () => void; }> = (props) => {
	return (
		<ListOf
			items={props.filterOptions}
			direction="row" wrap
			px={16} py={16} gap={16} grow
			forEachItem={(filterOption) => (
				<Layout key={filterOption.labelKey} direction="column" basis="0px" grow minWidth="20%" maxWidth="33%" justifyContent="space-between">
					<Button type="button" onClick={() => { props.onClosed(); props.onPicked(filterOption); }}><TranslatedText textKey={filterOption.labelKey} /></Button>
				</Layout>
			)}
		/>
	);
};

const ConfigureFilterModal: React.FC<{ newFilter: ItemFilterValue; onClosed: () => void; }> = (props) => {
	return (
		<>
			<TranslatedText textKey={props.newFilter.FilterType.labelKey} />
		</>
	);
};
