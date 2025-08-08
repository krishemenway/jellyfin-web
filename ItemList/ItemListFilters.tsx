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
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { SortFuncs } from "Common/Sort";
import { BaseItemDto, QueryFiltersLegacy, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { Form } from "Common/Form";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { TextField } from "Common/TextField";
import { FieldLabel } from "Common/FieldLabel";

export interface ItemListFiltersProps {
	listOptions: ItemListViewOptions;
	user: UserDto;
	library: BaseItemDto;
	filters: QueryFiltersLegacy;
}

export const ItemListFilters: React.FC<ItemListFiltersProps> = (props) => {
	const [addFilterOpen, setAddFilterOpen] = React.useState(false);
	const [addSortOpen, setAddSortOpen] = React.useState(false);
	const sorts = useObservable(props.listOptions.SortBy);
	const filters = useObservable(props.listOptions.Filters);
	const newFilter = useObservable(props.listOptions.NewFilter);
	const [filterButtonRef, setFilterButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const [sortButtonRef, setSortButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const [saveButtonRef, setSaveButtonRef] = React.useState<HTMLButtonElement|null>(null);

	return (
		<>
			<Layout direction="row" gap="1em">
				<Button type="button" px=".5em" py=".25em" justifyContent="center" alignItems="center" onClick={(button) => { setSaveButtonRef(button)}} icon={<SaveIcon />} />

				{(props.listOptions.ItemKindService?.filterOptions ?? []).length > 0 && (
					<Layout direction="row" gap=".5em" alignItems="center">
						<TranslatedText textKey="Filters" elementType="div" formatText={(t) => `${t}:`} />
						<Button px=".25em" py=".25em" type="button" onClick={() => setAddFilterOpen(true)} ref={(element) => { setFilterButtonRef(element); }} icon={<AddIcon />} />
						<ListOf
							items={filters}
							direction="row" gap=".5em"
							forEachItem={(filter) => <ConfiguredFilter key={filter.Key} filter={filter} listOptions={props.listOptions} />}
						/>
					</Layout>
				)}

				{(props.listOptions.ItemKindService?.sortOptions ?? []).length > 0 && (
					<Layout direction="row" gap=".5em" alignItems="center">
						<TranslatedText textKey="HeaderSortBy" elementType="div" formatText={(t) => `${t}:`} />
						<Button px=".25em" py=".25em" type="button" onClick={() => setAddSortOpen(true)} ref={(element) => { setSortButtonRef(element); }} icon={<AddIcon />} />
						<ListOf
							items={sorts}
							direction="row" gap=".5em"
							forEachItem={(sort) => <ConfiguredSort key={sort.LabelKey} sort={sort} listOptions={props.listOptions} />}
						/>
					</Layout>
				)}

				<Layout direction="column" grow></Layout>

				{(props.listOptions.ItemKindService?.listActions ?? []).length > 0 && (
					<ItemActionsMenu items={[props.library]} user={props.user} alignSelf="end" actions={props.listOptions.ItemKindService?.listActions ?? []} />
				)}
			</Layout>

			<AnchoredModal anchorElement={filterButtonRef} open={addFilterOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => setAddFilterOpen(false)}>
				<PickFilterModal filterOptions={props.listOptions.ItemKindService?.filterOptions ?? []} onPicked={(option) => props.listOptions.CreateNewFilter(option)} onClosed={() => setAddFilterOpen(false)} />
			</AnchoredModal>

			<AnchoredModal anchorElement={filterButtonRef} open={newFilter !== undefined} anchorAlignment="center" opensInDirection="right" onClosed={() => props.listOptions.ClearNewFilter()}>
				{newFilter && <ConfigureFilterModal libraryId={props.library.Id!} listOptions={props.listOptions} newFilter={newFilter} filters={props.filters} onClosed={() => props.listOptions.ClearNewFilter()} />}
			</AnchoredModal>

			<AnchoredModal anchorElement={sortButtonRef} open={addSortOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => setAddSortOpen(false)} maxWidth="20%">
				<PickSortOptionModal sortOptions={props.listOptions.ItemKindService?.sortOptions ?? []} onPicked={(option, reversed) => props.listOptions.AddSort(option, reversed)} onClosed={() => setAddSortOpen(false)} />
			</AnchoredModal>

			<AnchoredModal anchorElement={saveButtonRef} open={saveButtonRef !== null} anchorAlignment="center" opensInDirection="right" onClosed={() => setSaveButtonRef(null)}>
				<SaveOptionsModal listOptions={props.listOptions} onClosed={() => setSaveButtonRef(null)} />
			</AnchoredModal>
		</>
	);
};

const ConfiguredFilter: React.FC<{ filter: EditableItemFilter; listOptions: ItemListViewOptions }> = (props) => {
	const background = useBackgroundStyles();
	const displayValue = useObservable(props.filter.DisplayValue);

	return (
		<Layout direction="row" gap=".5em" className={background.alternatePanel} px=".5em" py=".25em">
			<Layout direction="row">
				<TranslatedText textKey={props.filter.FilterType.labelKey} />
				&nbsp;
				<TranslatedText textKey={displayValue[0]} textProps={displayValue.slice(1)} />
			</Layout>

			<Button type="button" onClick={() => props.listOptions.Filters.remove(props.filter)} icon={<DeleteIcon />} />
		</Layout>
	);
};

const ConfiguredSort: React.FC<{ sort: SortFuncs<BaseItemDto>; listOptions: ItemListViewOptions }> = (props) => {
	const background = useBackgroundStyles();

	return (
		<Layout direction="row" gap=".5em" className={background.alternatePanel} px=".5em" py=".25em">
			{props.sort.Reversed ? <ArrowUpIcon /> : <ArrowDownIcon />}
			<TranslatedText textKey={props.sort.LabelKey} elementType="div" />
			<Button type="button" onClick={() => props.listOptions.SortBy.remove(props.sort)} icon={<DeleteIcon />} />
		</Layout>
	);
};

const PickSortOptionModal: React.FC<{ sortOptions: ItemSortOption[]; onPicked: (option: ItemSortOption, reversed: boolean) => void; onClosed: () => void; }> = (props) => {
	return (
		<ListOf
			items={props.sortOptions}
			direction="column"
			px="1em" py="1em" gap="1em"
			maxWidth="416px"
			forEachItem={(sortOption) => (
				<Layout key={sortOption.labelKey} width="100%" direction="row" alignItems="center" gap="1em">
					<Button type="button" grow justifyContent="center" onClick={() => { props.onPicked(sortOption, false); props.onClosed(); }}><ArrowUpIcon /></Button>
					<TranslatedText elementType="div" textKey={sortOption.labelKey} />
					<Button type="button" grow justifyContent="center" onClick={() => { props.onPicked(sortOption, true); props.onClosed(); }}><ArrowDownIcon /></Button>
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
			px="1em" py="1em" gap="1em" grow
			maxWidth="400px"
			forEachItem={(filterOption) => (
				<Button
					key={filterOption.labelKey}
					label={filterOption.labelKey}
					type="button" onClick={() => { props.onClosed(); props.onPicked(filterOption); }}
					direction="column" justifyContent="space-between" width={{ itemsPerRow: 2, gap: "1em" }}
					px=".25em" py=".5em"
				/>
			)}
		/>
	);
};

const ConfigureFilterModal: React.FC<{ listOptions: ItemListViewOptions; newFilter: EditableItemFilter; filters: QueryFiltersLegacy; libraryId: string; onClosed: () => void; }> = (props) => {
	const operation = useObservable(props.newFilter.Operation.Current);
	const FilterTypeEditor = props.newFilter.FilterType.editor;

	return (
		<Form py="1em" px="1em" gap="1em" direction="column" onSubmit={() => { props.listOptions.AddNewFilter(); props.onClosed(); }} minWidth="20em">
			<Layout direction="row" justifyContent="center" gap="1em">
				<TranslatedText textKey={props.newFilter.FilterType.labelKey} elementType="div" />
				<SelectFieldEditor field={props.newFilter.Operation} allOptions={props.newFilter.FilterType.operations} getKey={(o) => o.Name} getLabel={(o) => o.Name} grow />
			</Layout>

			<FilterTypeEditor {...props} filter={props.newFilter} currentOperation={operation} />

			<Layout direction="row" gap="1em">
				<Button type="button" justifyContent="center" py=".25em" onClick={() => { props.onClosed(); }} grow><TranslatedText textKey="ButtonCancel" /></Button>
				<Button type="submit" justifyContent="center" py=".25em" grow><TranslatedText textKey="Save" /></Button>
			</Layout>
		</Form>
	);
};

const SaveOptionsModal: React.FC<{ listOptions: ItemListViewOptions; onClosed: () => void }> = (props) => {
	return (
		<Form direction="column" py="1em" px="1em" gap="1em" onSubmit={() => { props.onClosed(); }}>
			<Layout direction="column" gap=".5em">
				<FieldLabel field={props.listOptions.Label} />
				<TextField field={props.listOptions.Label} py=".25em" />
			</Layout>

			<Button type="submit" justifyContent="center" py=".5em"><TranslatedText textKey="Save" /></Button>
		</Form>
	);
};
