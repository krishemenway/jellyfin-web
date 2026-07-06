import * as React from "react";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { AnchoredModal } from "Common/Modal";
import { AddIcon } from "CommonIcons/AddIcon";
import { useObservable } from "@residualeffect/rereactor";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { useBreakpointValues } from "AppStyles";
import { ArrowDownIcon } from "CommonIcons/ArrowDownIcon";
import { ArrowUpIcon } from "CommonIcons/ArrowUpIcon";
import { LoadViewOptionsIcon } from "ItemList/LoadViewOptionsIcon";
import { ItemFilterType } from "ItemList/ItemFilterType";
import { ItemSortType } from "ItemList/ItemSortType";
import { IFilterModel } from "ItemList/ItemFilterType";
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { ItemSortTypeModel } from "ItemList/ItemSortTypeModel";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Form } from "Common/Form";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { TextField } from "Common/TextField";
import { ItemListService } from "ItemList/ItemListService";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { useIsBusy } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { useNavigate } from "react-router-dom";
import { RadioCheckedIcon } from "CommonIcons/RadioCheckedIcon";
import { RadioUncheckedIcon } from "CommonIcons/RadioUncheckedIcon";
import { FieldError } from "Common/FieldError";
import { VisibleIcon } from "CommonIcons/VisibleIcon";
import { HyperLink } from "Common/HyperLink";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";
import { EditIcon } from "CommonIcons/EditIcon";

export interface ItemListFiltersProps {
	listOptions: ItemListViewOptions;
	itemList: ItemListService;
	sortTypes: ItemSortType[];
	filterTypes: ItemFilterType[];
	settings: Settings;
	items: BaseItemDto[];
	remaining: number;
	additionalButtons?: React.ReactNode;
	baseUrl: string;
}

export const ItemListFilters: React.FC<ItemListFiltersProps> = ({ listOptions, itemList, sortTypes, filterTypes, items, remaining, additionalButtons, ...props }) => {
	const [addFilterOpen, setAddFilterOpen] = React.useState(false);
	const [addSortOpen, setAddSortOpen] = React.useState(false);
	const sorts = useObservable(listOptions.SortBy);
	const filters = useObservable(listOptions.Filters);
	const newFilter = useObservable(listOptions.NewFilter);
	const [filterButtonRef, setFilterButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const [sortButtonRef, setSortButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const [optionsListButtonRef, setOptionsListButtonRef] = React.useState<HTMLButtonElement|null>(null);
	const currentOptionLabel = useObservable(listOptions.Label.Current);
	const confirmDelete = useObservable(itemList.ConfirmDeleteOptions);

	return (
		<>
			<Layout direction="row" gap="1em" alignItems="center">
				<Button type="button" px=".5em" py=".25em" justifyContent="center" alignItems="center" onClick={(button) => { setOptionsListButtonRef(button)}} icon={<LoadViewOptionsIcon />} />

				{Nullable.StringValue(currentOptionLabel, <></>, (label) => <Layout direction="column">{label}</Layout>)}

				{filterTypes.length > 0 && (
					<Layout direction="row" gap=".5em" alignItems="center">
						<TranslatedText textKey="Filters" elementType="div" formatText={(t) => `${t}:`} />
						<Button px=".25em" py=".25em" type="button" onClick={() => setAddFilterOpen(true)} ref={(element) => { setFilterButtonRef(element); }} icon={<AddIcon />} />
						<ListOf
							items={filters}
							direction="row" gap=".5em"
							forEachItem={(filter) => <ConfiguredFilter key={filter.Key} filter={filter} listOptions={listOptions} items={items} />}
						/>
					</Layout>
				)}

				{sortTypes.length > 0 && (
					<Layout direction="row" gap=".5em" alignItems="center">
						<TranslatedText textKey="HeaderSortBy" elementType="div" formatText={(t) => `${t}:`} />
						<Button px=".25em" py=".25em" type="button" onClick={() => setAddSortOpen(true)} ref={(element) => { setSortButtonRef(element); }} icon={<AddIcon />} />
						<ListOf
							items={sorts}
							direction="row" gap=".5em"
							forEachItem={(sort) => <ConfiguredSort key={sort.Key} sort={sort} listOptions={listOptions} />}
						/>
					</Layout>
				)}

				<Layout direction="row">{items.length === remaining ? items.length : `${items.length} - ${items.length - remaining} = ${remaining}`}</Layout>

				<Layout direction="column" grow></Layout>

				{additionalButtons}
			</Layout>

			<AnchoredModal backgroundColor="Panel" anchorElement={filterButtonRef} open={addFilterOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => { setAddFilterOpen(false); }}>
				<PickFilterModal filterTypes={filterTypes} onPicked={(option) => listOptions.CreateNewFilter(option)} onClosed={() => { setAddFilterOpen(false); }} />
			</AnchoredModal>

			<AnchoredModal backgroundColor="Panel" anchorElement={filterButtonRef} open={newFilter !== undefined} anchorAlignment="center" opensInDirection="right" onClosed={() => listOptions.ClearNewFilter()}>
				{newFilter && <ConfigureFilterModal items={items} listOptions={listOptions} newFilter={newFilter} onClosed={() => listOptions.ClearNewFilter()} />}
			</AnchoredModal>

			<AnchoredModal backgroundColor="Panel" anchorElement={sortButtonRef} open={addSortOpen} anchorAlignment="center" opensInDirection="right" onClosed={() => setAddSortOpen(false)} maxWidth="20%">
				<PickSortOptionModal sortTypes={sortTypes} onPicked={(option) => listOptions.AddSort(option)} onClosed={() => setAddSortOpen(false)} />
			</AnchoredModal>

			<AnchoredModal backgroundColor="Panel" anchorElement={optionsListButtonRef} open={optionsListButtonRef !== null} anchorAlignment="center" opensInDirection="right" onClosed={() => { setOptionsListButtonRef(null); itemList.ConfirmDeleteOptions.Value = null; listOptions.ShowErrors.Value = false; }}>
				{confirmDelete === null && <PickOptionsModal {...props} itemList={itemList} onClosed={() => setOptionsListButtonRef(null)} />}
				{confirmDelete !== null && <ConfirmDelete {...props} itemList={itemList} options={confirmDelete} onClosed={() => { setOptionsListButtonRef(null); itemList.ConfirmDeleteOptions.Value = null; } } />}
			</AnchoredModal>
		</>
	);
};

const ConfiguredFilter: React.FC<{ filter: IFilterModel; listOptions: ItemListViewOptions; items: BaseItemDto[]; }> = ({ filter, listOptions, items }) => {
	const [editRef, setEditRef] = React.useState<HTMLButtonElement|null>(null);
	const displayValue = useObservable(filter.Display);

	return (
		<Layout direction="row" backgroundColor="AlternatePanel" bt br bb bl>
			<Layout direction="row" px="1em" py=".25em">
				{Nullable.Value(displayValue, <QuestionMarkIcon />, (config) => (
					<>
						<TranslatedText textKey={config.Field.Key} textProps={config.Field.KeyProps} />
						&nbsp;
						<TranslatedText textKey={config.Operation.Key} textProps={config.Operation.KeyProps} />
					</>
				))}
			</Layout>

			<AnchoredModal anchorElement={editRef} open={editRef !== null} onClosed={() => { setEditRef(null); }} opensInDirection="right">
				<Layout py="1em" px="1em" gap="1em" direction="column" minWidth="20em" maxWidth="26em">
					{filter.Editor(items)}
				</Layout>
			</AnchoredModal>

			<Button type="button" onClick={(button) => setEditRef(button)} icon={<EditIcon />} px=".25em" py=".25em" />
			<Button type="button" onClick={() => listOptions.RemoveFilter(filter)} icon={<DeleteIcon />} px=".25em" py=".25em" />
		</Layout>
	);
};

const ConfiguredSort: React.FC<{ sort: ItemSortTypeModel; listOptions: ItemListViewOptions }> = ({ sort, listOptions }) => {
	const reversed = useObservable(sort.Reversed.Current);
	const hidden = useObservable(sort.ContentHidden.Current);

	return (
		<Layout direction="row" gap="1em"  backgroundColor="AlternatePanel" bt br bb bl alignItems="center">
			<Button type="button" onClick={() => sort.Reversed.OnChange(!reversed)} direction="row" px=".25em" py=".25em" icon={reversed ? <ArrowUpIcon /> : <ArrowDownIcon />} />
			<TranslatedText textKey={sort.SortType.labelKey} elementType="div" />

			<Layout direction="row">
				<Button type="button" onClick={() => listOptions.RemoveSort(sort)} icon={<DeleteIcon />} px=".25em" py=".25em" />
				<Button type="button" onClick={() => sort.ContentHidden.OnChange(!hidden)} px=".25em" py=".25em"><VisibleIcon visible={!hidden} /></Button>
			</Layout>
		</Layout>
	);
};

const PickSortOptionModal: React.FC<{ sortTypes: ItemSortType[]; onPicked: (option: ItemSortType) => void; onClosed: () => void; }> = ({ sortTypes, onPicked, onClosed }) => {
	const itemsPerRow = useBreakpointValues(1, 2, 2, 2);

	return (
		<ListOf
			items={sortTypes}
			direction="row" wrap
			px="1em" py="1em" gap="1em" width="25rem"
			forEachItem={(sortOption) => (
				<Button
					key={sortOption.labelKey} label={{ Key: sortOption.labelKey }}
					type="button" onClick={() => { onPicked(sortOption); onClosed(); }}
					direction="column" width={{ itemsPerRow: itemsPerRow, gap: "1em" }} px=".25em" py=".5em"
				/>
			)}
		/>
	);
};

const PickFilterModal: React.FC<{ filterTypes: ItemFilterType[]; onPicked: (option: ItemFilterType) => void; onClosed: () => void; }> = (props) => {
	const itemsPerRow = useBreakpointValues(1, 2, 2, 2);

	return (
		<ListOf
			items={props.filterTypes}
			direction="row" wrap
			px="1em" py="1em" gap="1em" grow width="25rem"
			forEachItem={(filterType) => (
				<Button
					key={filterType.FilterType} label={{ Key: filterType.Label }}
					type="button" onClick={() => { props.onPicked(filterType); props.onClosed(); }}
					direction="column" width={{ itemsPerRow: itemsPerRow, gap: "1em" }} px=".5em" py=".5em"
				/>
			)}
		/>
	);
};

const ConfigureFilterModal: React.FC<{ listOptions: ItemListViewOptions; newFilter: IFilterModel; onClosed: () => void; items: BaseItemDto[]; }> = ({ listOptions, newFilter, onClosed, items }) => {
	return (
		<Form py="1em" px="1em" gap="1em" direction="column" onSubmit={() => { listOptions.AddNewFilter(() => onClosed()); }} minWidth="20em" maxWidth="26em">
			{newFilter.Editor(items)}

			<Layout direction="row" gap="1em">
				<Button type="button" justifyContent="center" py=".25em" onClick={() => { onClosed(); }} grow><TranslatedText textKey="ButtonCancel" /></Button>
				<Button type="submit" justifyContent="center" py=".25em" grow><TranslatedText textKey="Save" /></Button>
			</Layout>
		</Form>
	);
};

const PickOptionsModal: React.FC<{ itemList: ItemListService; settings: Settings; baseUrl: string; onClosed: () => void }> = ({ itemList, baseUrl, ...props }) => {
	const itemFilterOptions = useObservable(itemList.ExistingOptions);
	const current = useObservable(itemList.ListOptions);

	return (
		<Layout direction="column" py="1em" px="1em" gap="1em" minWidth="16rem">
			<ListOf
				direction="column"
				items={itemFilterOptions}
				forEachItem={(option) => <PickOptionsLink itemList={itemList} baseUrl={baseUrl} key={option.Key} itemListViewOptions={option} isSelected={option === current} {...props} />}
			/>

			{!current?.IsUnsaved && <HyperLink to={baseUrl} direction="row" px=".5em" py=".5em" gap=".5rem" icon={<RadioUncheckedIcon />} label="New" />}
			{current?.IsUnsaved && <SaveNewOptions itemList={itemList} baseUrl={baseUrl} listOptions={current} {...props} />}
		</Layout>
	);
};

const SaveNewOptions: React.FC<{ itemList: ItemListService; settings: Settings; listOptions: ItemListViewOptions; baseUrl: string; onClosed: () => void }> = ({ itemList, settings, listOptions, baseUrl, onClosed }) => {
	const navigate = useNavigate();
	const isBusy = useIsBusy(SettingsStore.Instance.SaveSettingsResult);
	const showErrors = useObservable(listOptions.ShowErrors);

	return (
		<Form
			direction="row" gap=".5rem" alignItems="start"
			onSubmit={() => { itemList.SaveViewOptions(settings, listOptions, (newFilterLabelOrNull) => { onClosed(); Nullable.TryExecute(newFilterLabelOrNull, (label) => navigate(`${baseUrl}/${label}`)) }); }}>

			<Layout direction="column" grow>
				<TextField field={listOptions.Label} py=".25em" px=".5em" grow placeholder={{ Key: "LabelNewName" }} bt br bb bl backgroundColor="Field" />
				<FieldError field={listOptions.Label} showErrors={showErrors} />
			</Layout>

			<Button type="submit" justifyContent="center" px=".5em" py=".5em">
				{isBusy ? <LoadingIcon /> : <SaveIcon />}
			</Button>
		</Form>
	);
};

const PickOptionsLink: React.FC<{ itemList: ItemListService; itemListViewOptions: ItemListViewOptions; baseUrl: string; settings: Settings; isSelected: boolean }> = ({ itemList, itemListViewOptions, baseUrl, settings, isSelected }) => {
	const label = useObservable(itemListViewOptions.Label.Current);
	const hasChanged = useObservable(itemListViewOptions.HasChanged);

	return (
		<Layout direction="row" justifyContent="space-between" gap=".5rem">
			{!itemListViewOptions.IsReadOnly && isSelected ? (
				<Layout direction="row" grow px=".5em" gap=".5rem" alignItems="center">
					<RadioCheckedIcon />
					<TextField field={itemListViewOptions.Label} px=".25em" py=".25em" bt br bb bl backgroundColor="Field" />
				</Layout>
			) : (
				<HyperLink
					key={label}
					to={`${baseUrl}/${itemListViewOptions.Key}`}
					direction="row" px=".5em" py=".5em" grow gap=".5rem" alignItems="center"
					icon={isSelected ? <RadioCheckedIcon /> : <RadioUncheckedIcon />}
					children={label}
				/>
			)}

			{!itemListViewOptions.IsReadOnly && isSelected && (
				<Layout direction="row" gap=".25rem">
					<Button
						type="button"
						px=".5em" py=".5em"
						justifyContent="center" alignItems="center" disabled={!hasChanged}
						onClick={() => { itemList.SaveViewOptions(settings, itemListViewOptions, () => { }); }}
						icon={<SaveIcon />}
					/>

					<Button
						type="button"
						px=".5em" py=".5em"
						justifyContent="center" alignItems="center"
						onClick={() => itemList.ConfirmDeleteOptions.Value = itemListViewOptions}
						icon={<DeleteIcon />}
					/>
				</Layout>
			)}
		</Layout>
	);
};

const ConfirmDelete: React.FC<{ itemList: ItemListService; settings: Settings; baseUrl: string; options: ItemListViewOptions; onClosed: () => void }> = ({ itemList, settings, baseUrl, options, onClosed }) => {
	const navigate = useNavigate();

	return (
		<Layout direction="column" px="2rem" py="2rem" maxWidth="20rem" gap="1em">
			<TranslatedText textKey="ConfirmDeleteFilterOption" textProps={[options.Label.Saved.Value]} />

			<Layout direction="row" gap="1rem" width="100%" justifyContent="end">
				<Button type="button" label="ButtonCancel" onClick={() => { onClosed() }} px="1em" py=".5em" />
				<Button type="button" label="ButtonRemove" onClick={() => { itemList.RemoveViewOptions(settings, options, () => { onClosed(); navigate(baseUrl); }); }} px="1em" py=".5em" />
			</Layout>
		</Layout>
	);
};
