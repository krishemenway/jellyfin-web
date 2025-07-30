import * as React from "react";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { AnchoredModal } from "Common/Modal";
import { AddIcon } from "CommonIcons/AddIcon";
import { useObservable } from "@residualeffect/rereactor";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { useBackgroundStyles } from "AppStyles";
import { ArrowDownIcon } from "CommonIcons/ArrowDownIcon";
import { ArrowUpIcon } from "CommonIcons/ArrowUpIcon";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { EditableItemFilter } from "ItemList/EditableItemFilter";
import { ItemListViewOptionsService } from "./ItemListViewOptionsService";
import { ItemListViewOptions } from "./ItemListViewOptions";
import { SortFuncs } from "Common/Sort";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { Form } from "Common/Form";
import { ItemActionsMenu } from "Items/ItemActionsMenu";

export interface ItemListFiltersProps {
	service: ItemListViewOptionsService;
	user: UserDto;
}

export const ItemListFilters: React.FC<ItemListFiltersProps> = (props) => {
	const [addFilterOpen, setAddFilterOpen] = React.useState(false);
	const [addSortOpen, setAddSortOpen] = React.useState(false);
	const listOptions = useObservable(props.service.ViewOptions);
	const sorts = useObservable(listOptions.SortBy);
	const filters = useObservable(listOptions.Filters);
	const newFilter = useObservable(listOptions.NewFilter);
	const stopEditingNewFilter = () => listOptions.NewFilter.Value = undefined;
	const [filterButtonRef, setFilterButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const [sortButtonRef, setSortButtonRef] = React.useState<HTMLButtonElement|null>(null);

	return (
		<>
			<Layout direction="row" gap={16}>
				{(props.service.ItemKindService?.filterOptions ?? []).length > 0 && (
					<Layout direction="row" gap={8} alignItems="center">
						<TranslatedText textKey="Filters" elementType="div" formatText={(t) => `${t}:`} />
						<Button px={8} py={4} type="button" onClick={() => setAddFilterOpen(true)} ref={(element) => { setFilterButtonRef(element); }}><AddIcon size={16} /></Button>
						<ListOf
							items={filters}
							direction="row" gap={8}
							forEachItem={(filter) => <ConfiguredFilter key={filter.Key} filter={filter} listOptions={listOptions} />}
						/>
					</Layout>
				)}

				{(props.service.ItemKindService?.sortOptions ?? []).length > 0 && (
					<Layout direction="row" gap={8} alignItems="center">
						<TranslatedText textKey="HeaderSortBy" elementType="div" formatText={(t) => `${t}:`} />
						<Button px={8} py={4} type="button" onClick={() => setAddSortOpen(true)} ref={(element) => { setSortButtonRef(element); }}><AddIcon size={16} /></Button>
						<ListOf
							items={sorts}
							direction="row" gap={8}
							forEachItem={(sort) => <ConfiguredSort key={sort.LabelKey} sort={sort} listOptions={listOptions} />}
						/>
					</Layout>
				)}

				<Layout direction="column" grow></Layout>

				{(props.service.ItemKindService?.listActions ?? []).length > 0 && (
					<ItemActionsMenu user={props.user} fontSize="1.5em" alignSelf="end" actions={props.service.ItemKindService?.listActions ?? []} />
				)}
			</Layout>

			<AnchoredModal anchorElement={filterButtonRef} open={addFilterOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => setAddFilterOpen(false)}>
				<PickFilterModal filterOptions={props.service.ItemKindService?.filterOptions ?? []} onPicked={(option) => props.service.CreateNewFilter(option)} onClosed={() => setAddFilterOpen(false)} />
			</AnchoredModal>

			<AnchoredModal anchorElement={filterButtonRef} open={newFilter !== undefined} anchorAlignment="center" opensInDirection="right" onClosed={stopEditingNewFilter}>
				{newFilter && <ConfigureFilterModal listOptions={listOptions} newFilter={newFilter} onClosed={stopEditingNewFilter} />}
			</AnchoredModal>

			<AnchoredModal anchorElement={sortButtonRef} open={addSortOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => setAddSortOpen(false)} maxWidth="20%">
				<PickSortOptionModal sortOptions={props.service.ItemKindService?.sortOptions ?? []} onPicked={(option, reversed) => listOptions.AddSort(option, reversed)} onClosed={() => setAddSortOpen(false)} />
			</AnchoredModal>
		</>
	);
};

const ConfiguredFilter: React.FC<{ filter: EditableItemFilter; listOptions: ItemListViewOptions }> = (props) => {
	const background = useBackgroundStyles();
	const displayValue = useObservable(props.filter.DisplayValue);

	return (
		<Layout direction="row" gap={8} className={background.alternatePanel} px={8} py={4}>
			<TranslatedText textKey={props.filter.FilterType.labelKey} elementType="div" />
			<TranslatedText textKey={displayValue[0]} textProps={displayValue.slice(1)} />
			<Button type="button" onClick={() => props.listOptions.Filters.remove(props.filter)}><DeleteIcon size={16} /></Button>
		</Layout>
	);
};

const ConfiguredSort: React.FC<{ sort: SortFuncs<BaseItemDto>; listOptions: ItemListViewOptions }> = (props) => {
	const background = useBackgroundStyles();

	return (
		<Layout direction="row" gap={8} className={background.alternatePanel} px={8} py={4}>
			{props.sort.Reversed ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
			<TranslatedText textKey={props.sort.LabelKey} elementType="div" />
			<Button type="button" onClick={() => props.listOptions.SortBy.remove(props.sort)}><DeleteIcon size={16} /></Button>
		</Layout>
	);
};

const PickSortOptionModal: React.FC<{ sortOptions: ItemSortOption[]; onPicked: (option: ItemSortOption, reversed: boolean) => void; onClosed: () => void; }> = (props) => {
	return (
		<ListOf
			items={props.sortOptions}
			direction="row" wrap
			px={16} py={16} gap={16} grow
			maxWidth="400px"
			forEachItem={(sortOption) => (
				<Layout key={sortOption.labelKey} direction="column" width={{ itemsPerRow: 2, gap: 16 }} justifyContent="space-between" textAlign="center" gap="1em">
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
			maxWidth="400px"
			forEachItem={(filterOption) => (
				<Button
					key={filterOption.labelKey}
					type="button" onClick={() => { props.onClosed(); props.onPicked(filterOption); }}
					direction="column"
					justifyContent="space-between"
					width={{ itemsPerRow: 2, gap: 16 }}
					px={4} py={8}
				>
					<TranslatedText textKey={filterOption.labelKey} />
				</Button>
			)}
		/>
	);
};

const ConfigureFilterModal: React.FC<{ listOptions: ItemListViewOptions; newFilter: EditableItemFilter; onClosed: () => void; }> = (props) => {
	const FilterTypeEditor = props.newFilter.FilterType.editor;

	return (
		<Form direction="column" onSubmit={() => { props.listOptions.AddNewFilter(); props.onClosed(); }}>
			<Layout direction="column" justifyContent="center"><TranslatedText textKey={props.newFilter.FilterType.labelKey} /></Layout>

			<SelectFieldEditor field={props.newFilter.Operation} getKey={(o) => o.Name} getLabel={(o) => o.Name} />
			<FilterTypeEditor filter={props.newFilter} />

			<Layout direction="row">
				<Button type="button" onClick={() => { props.onClosed(); }} grow>Cancel</Button>
				<Button type="submit" grow>Save</Button>
			</Layout>
		</Form>
	);
};
