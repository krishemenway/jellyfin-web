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
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { BaseItemKindServiceFactory } from "../Items/BaseItemKindServiceFactory";

export interface ItemListFiltersProps {
	itemId: string;
	itemKind: BaseItemKind;
	service: ItemListService;
}

export const ItemListFilters: React.FC<ItemListFiltersProps> = (props) => {
	const background = useBackgroundStyles();
	const filterOptions = React.useMemo(() => BaseItemKindServiceFactory.FindOrNull(props.itemKind)?.filterOptions ?? [], [ props.itemKind ]);
	const sortOptions = React.useMemo(() => BaseItemKindServiceFactory.FindOrNull(props.itemKind)?.sortOptions ?? [], [ props.itemKind ]);

	const [addFilterOpen, setAddFilterOpen] = React.useState(false);
	const [addSortOpen, setAddSortOpen] = React.useState(false);
	const currentFilter = useObservable(props.service.Filter);
	const sorts = useObservable(currentFilter.SortBy);
	const newFilter = useObservable(currentFilter.NewFilter);

	return (
		<Layout direction="row" gap={16} py={16}>
			<Layout direction="row" gap={8} alignItems="center">
				<TranslatedText textKey="HeaderSortBy" elementType="div" formatText={(t) => `${t}:`} />
				<Button px={8} py={4} type="button" onClick={() => setAddSortOpen(true)}><AddIcon size={16} /></Button>
				<ListOf
					items={sorts}
					direction="row"
					forEachItem={(sort) => (
						<Layout direction="row" gap={16} className={background.alternatePanel} px={8} py={4}>
							<TranslatedText textKey={sort.LabelKey} elementType="div" />
							{sort.Reversed ? <ArrowUpIcon size={20} /> : <ArrowDownIcon size={20} />}
							<Button type="button" onClick={() => currentFilter.SortBy.remove(sort)}><DeleteIcon size={20} /></Button>
						</Layout>
					)}
				/>
			</Layout>

			<CenteredModal open={addFilterOpen} onClosed={() => setAddFilterOpen(false)}>
				<ListOf
					items={filterOptions}
					direction="row" wrap
					px={16} py={16} gap={16} grow={1}
					forEachItem={(filterOption) => (
						<Layout key={filterOption.labelKey} direction="column" basis="0px" grow={1} minWidth="20%" maxWidth="33%" justifyContent="space-between">
							<Button type="button" onClick={() => { props.service.CreateNewFilter(filterOption); }}><TranslatedText textKey={filterOption.labelKey} /></Button>
						</Layout>
					)}
				/>
			</CenteredModal>

			<CenteredModal open={newFilter !== undefined} onClosed={() => currentFilter.NewFilter.Value = undefined}>
				Configure Filter
			</CenteredModal>

			<CenteredModal open={addSortOpen} onClosed={() => setAddSortOpen(false)} maxWidth="20%">
				<ListOf
					items={sortOptions}
					direction="row" wrap
					px={16} py={16} gap={16} grow={1}
					forEachItem={(sortOption) => (
						<Layout key={sortOption.labelKey} direction="column" basis="0px" grow={1} minWidth="20%" maxWidth="33%" justifyContent="space-between">
							<TranslatedText textKey={sortOption.labelKey}  />
							<Layout direction="row" justifyContent="center" alignItems="center">
								<Button type="button" grow={1} justifyContent="center" onClick={() => { currentFilter.AddSort(sortOption, false); setAddSortOpen(false); }}><ArrowUpIcon size={20} /></Button>
								<Button type="button" grow={1} justifyContent="center" onClick={() => { currentFilter.AddSort(sortOption, true); setAddSortOpen(false); }}><ArrowDownIcon size={20} /></Button>
							</Layout>
						</Layout>
					)}
				/>
			</CenteredModal>
		</Layout>
	);
};
