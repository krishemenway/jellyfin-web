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
import { LoadViewOptionsIcon } from "ItemList/LoadViewOptionsIcon";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortOption } from "ItemList/ItemSortOption";
import { EditableItemFilter } from "ItemList/EditableItemFilter";
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { SortFuncs } from "Common/Sort";
import { BaseItemDto, QueryFiltersLegacy, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { Form } from "Common/Form";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { TextField } from "Common/TextField";
import { ItemListService } from "ItemList/ItemListService";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { LinkToItem, useUrlToItem as urlToItem } from "Items/LinkToItem";
import { useIsBusy } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { useNavigate } from "react-router-dom";
import { RadioCheckedIcon } from "CommonIcons/RadioCheckedIcon";
import { RadioUncheckedIcon } from "CommonIcons/RadioUncheckedIcon";
import { FieldError } from "Common/FieldError";

export interface ItemListFiltersProps {
	listOptions: ItemListViewOptions;
	itemList: ItemListService;
	user: UserDto;
	library: BaseItemDto;
	settings: Settings;
	filters: QueryFiltersLegacy;
	total: number;
	remaining: number;
}

export const ItemListFilters: React.FC<ItemListFiltersProps> = (props) => {
	const [addFilterOpen, setAddFilterOpen] = React.useState(false);
	const [addSortOpen, setAddSortOpen] = React.useState(false);
	const sorts = useObservable(props.listOptions.SortBy);
	const filters = useObservable(props.listOptions.Filters);
	const newFilter = useObservable(props.listOptions.NewFilter);
	const [filterButtonRef, setFilterButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const [sortButtonRef, setSortButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const [optionsListButtonRef, setOptionsListButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const currentOptionLabel = useObservable(props.listOptions.Label.Current);
	const confirmDelete = useObservable(props.itemList.ConfirmDeleteOptions);

	return (
		<>
			<Layout direction="row" gap="1em" alignItems="center">
				<Button type="button" px=".5em" py=".25em" justifyContent="center" alignItems="center" onClick={(button) => { setOptionsListButtonRef(button)}} icon={<LoadViewOptionsIcon />} />

				{(Nullable.StringHasValue(currentOptionLabel) && <Layout direction="column">{currentOptionLabel}</Layout>)}

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

				<Layout direction="row">{props.total === props.remaining ? props.total : `${props.total} - ${props.total - props.remaining} = ${props.remaining}`}</Layout>

				<Layout direction="column" grow></Layout>

				{(props.listOptions.ItemKindService?.listActions ?? []).length > 0 && (
					<ItemActionsMenu items={[props.library]} user={props.user} alignSelf="end" actions={props.listOptions.ItemKindService?.listActions ?? []} />
				)}
			</Layout>

			<AnchoredModal anchorElement={filterButtonRef} open={addFilterOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => { setAddFilterOpen(false); }}>
				<PickFilterModal filterOptions={props.listOptions.ItemKindService?.filterOptions ?? []} onPicked={(option) => props.listOptions.CreateNewFilter(option)} onClosed={() => { setAddFilterOpen(false); }} />
			</AnchoredModal>

			<AnchoredModal anchorElement={filterButtonRef} open={newFilter !== undefined} anchorAlignment="center" opensInDirection="right" onClosed={() => props.listOptions.ClearNewFilter()}>
				{newFilter && <ConfigureFilterModal libraryId={props.library.Id!} listOptions={props.listOptions} newFilter={newFilter} filters={props.filters} onClosed={() => props.listOptions.ClearNewFilter()} />}
			</AnchoredModal>

			<AnchoredModal anchorElement={sortButtonRef} open={addSortOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => setAddSortOpen(false)} maxWidth="20%">
				<PickSortOptionModal sortOptions={props.listOptions.ItemKindService?.sortOptions ?? []} onPicked={(option, reversed) => props.listOptions.AddSort(option, reversed)} onClosed={() => setAddSortOpen(false)} />
			</AnchoredModal>

			<AnchoredModal anchorElement={optionsListButtonRef} open={optionsListButtonRef !== null} anchorAlignment="center" opensInDirection="right" onClosed={() => { setOptionsListButtonRef(null); props.itemList.ConfirmDeleteOptions.Value = null; props.listOptions.ShowErrors.Value = false; }}>
				{confirmDelete === null && <PickOptionsModal {...props} onClosed={() => setOptionsListButtonRef(null)} />}
				{confirmDelete !== null && <ConfirmDelete {...props} options={confirmDelete} onClosed={() => { setOptionsListButtonRef(null); props.itemList.ConfirmDeleteOptions.Value = null; } } />}
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
		<Form py="1em" px="1em" gap="1em" direction="column" onSubmit={() => { props.listOptions.AddNewFilter(); props.onClosed(); }} minWidth="20em" maxWidth="26em">
			<Layout direction="row" alignItems="center" justifyContent="center" gap="1em">
				<Layout direction="column" fontSize="1.2em"><TranslatedText textKey={props.newFilter.FilterType.labelKey} /></Layout>
				<AutoCompleteFieldEditor field={props.newFilter.Operation} allOptions={props.newFilter.FilterType.operations} getValue={(o) => o.Name} getLabel={(o) => <TranslatedText textKey={o.Name} />} grow />
			</Layout>

			<FilterTypeEditor {...props} filter={props.newFilter} currentOperation={operation} />

			<Layout direction="row" gap="1em">
				<Button type="button" justifyContent="center" py=".25em" onClick={() => { props.onClosed(); }} grow><TranslatedText textKey="ButtonCancel" /></Button>
				<Button type="submit" justifyContent="center" py=".25em" grow><TranslatedText textKey="Save" /></Button>
			</Layout>
		</Form>
	);
};

const PickOptionsModal: React.FC<{ itemList: ItemListService; settings: Settings; library: BaseItemDto; onClosed: () => void }> = (props) => {
	const itemFilterOptions = useObservable(props.itemList.ExistingOptions);
	const current = useObservable(props.itemList.ListOptions);

	return (
		<Layout direction="column" py="1em" px="1em" gap="1em" minWidth="16rem">
			<ListOf
				direction="column"
				items={itemFilterOptions}
				forEachItem={(option) => <PickOptionsLink key={option.Key} itemListViewOptions={option} isSelected={option === current} {...props} />}
			/>

			{!current?.IsUnsaved && (
				<LinkToItem
					item={props.library}
					direction="row" px=".5em" py=".5em" gap=".5rem">
					<RadioUncheckedIcon />
					<TranslatedText textKey="New" />
				</LinkToItem>
			)}

			{current?.IsUnsaved && (
				<SaveNewOptions listOptions={current} {...props} />
			)}
		</Layout>
	);
};

const SaveNewOptions: React.FC<{ itemList: ItemListService; settings: Settings; listOptions: ItemListViewOptions; library: BaseItemDto; onClosed: () => void }> = (props) => {
	const navigate = useNavigate();
	const isBusy = useIsBusy(SettingsStore.Instance.SaveSettingsResult);
	const showErrors = useObservable(props.listOptions.ShowErrors);

	return (
		<Form
			direction="row" gap=".5rem" alignItems="start"
			onSubmit={() => { props.itemList.SaveViewOptions(props.settings, props.listOptions, (newFilterLabelOrNull) => { props.onClosed(); Nullable.TryExecute(newFilterLabelOrNull, (label) => navigate(urlToItem(props.library, `/${label}`))) }); }}>

			<Layout direction="column" grow>
				<TextField field={props.listOptions.Label} py=".25em" px=".5em" grow placeholder={{ Key: "LabelNewName" }} />
				<FieldError field={props.listOptions.Label} showErrors={showErrors} />
			</Layout>

			<Button type="submit" justifyContent="center" px=".5em" py=".5em">
				{isBusy ? <LoadingIcon /> : <SaveIcon />}
			</Button>
		</Form>
	);
};

const PickOptionsLink: React.FC<{ itemList: ItemListService; itemListViewOptions: ItemListViewOptions; library: BaseItemDto; settings: Settings; isSelected: boolean }> = (props) => {
	const label = useObservable(props.itemListViewOptions.Label.Current);

	return (
		<Layout direction="row" justifyContent="space-between" gap=".5rem">
			<LinkToItem
				key={label} item={props.library}
				afterUrl={`/${label}`}
				direction="row" px=".5em" py=".5em" grow gap=".5rem" alignItems="center">
				{props.isSelected ? <RadioCheckedIcon /> : <RadioUncheckedIcon />}
				{label}
			</LinkToItem>

			<Button
				type="button"
				px=".5em" py=".5em"
				justifyContent="center" alignItems="center"
				onClick={() => { props.itemList.SaveViewOptions(props.settings, props.itemListViewOptions, () => { }); }}
				icon={<SaveIcon />}
			/>

			<Button
				type="button"
				px=".5em" py=".5em"
				justifyContent="center" alignItems="center"
				onClick={() => props.itemList.ConfirmDeleteOptions.Value = props.itemListViewOptions}
				icon={<DeleteIcon />}
			/>
		</Layout>
	);
};

const ConfirmDelete: React.FC<{ itemList: ItemListService; settings: Settings; library: BaseItemDto; options: ItemListViewOptions; onClosed: () => void }> = (props) => {
	const navigate = useNavigate();

	return (
		<Layout direction="column" px="2rem" py="2rem" maxWidth="20rem" gap="1em">
			<TranslatedText textKey="ConfirmDeleteFilterOption" textProps={[props.options.Label.Saved.Value]} />

			<Layout direction="row" gap="1rem" width="100%" justifyContent="end">
				<Button type="button" label="ButtonCancel" onClick={() => { props.onClosed() }} px="1em" py=".5em" />
				<Button type="button" label="ButtonRemove" onClick={() => { props.itemList.RemoveViewOptions(props.settings, props.options, () => { props.onClosed(); navigate(urlToItem(props.library)); }); }} px="1em" py=".5em" />
			</Layout>
		</Layout>
	);
};
