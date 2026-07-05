import * as React from "react";
import { TranslatedText, TranslationRequest } from "Common/TranslatedText";
import { ReverseSort, SortFunc } from "Common/ArrayPrototype";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Button } from "Common/Button";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { ArrowUpIcon } from "CommonIcons/ArrowUpIcon";
import { ArrowDownIcon } from "CommonIcons/ArrowDownIcon";

interface DataTableColumn<T> {
	id: string;
	header: TranslationRequest;
	content: (item: T) => React.ReactNode;
	sortFunc?: SortFunc<T>;
}

interface DataTableProps<T> extends StyleLayoutProps {
	items: T[];
	columns: DataTableColumn<T>[];
	defaultSortColumn?: string;
	defaultSortReversed?: boolean;
	keyFunc: (i: T) => React.Key;
	tableDataProps?: StyleLayoutProps;
	tableHeaderElementProps?: StyleLayoutProps;
	tableHeaderButtonProps?: StyleLayoutProps;
}

export function DataTable<T>({ items, columns, keyFunc, tableHeaderElementProps, tableHeaderButtonProps, tableDataProps, defaultSortColumn, defaultSortReversed, ...props }: DataTableProps<T>): React.ReactNode {
	const [sortColumn, setSortColumn] = React.useState<DataTableColumn<T>|undefined>(Nullable.Value(defaultSortColumn, undefined, (columnId) => columns.single(i => i.id === columnId)));
	const [reverseSort, setReverseSort] = React.useState(defaultSortReversed ?? false);
	const sortedItems = React.useMemo(() => Nullable.Value(sortColumn, items, (sortColumn) => items.sort(reverseSort ? ReverseSort(sortColumn.sortFunc!) : sortColumn.sortFunc)), [items, reverseSort, sortColumn]);

	return (
		<Layout direction="column" elementType="table" display="table" {...props}>
			<thead>
				<tr>
				{columns.map((column) => (
					<Layout key={column.id} elementType="th" direction="row" display="table-cell" {...tableHeaderElementProps}>
						{Nullable.Value(column.sortFunc, <TranslatedText key={column.header.Key} textKey={column.header} />, () => (
							<Button type="button" width="100%" alignItems="center" justifyContent="space-between" key={column.header.Key} onClick={() => { if (sortColumn === column) { setReverseSort(!reverseSort); } else { setSortColumn(column); setReverseSort(false); }}} {...tableHeaderButtonProps}>
								<TranslatedText textKey={column.header} />
								{sortColumn === column ? (reverseSort ? <ArrowUpIcon /> : <ArrowDownIcon />) : undefined}
							</Button>
						))}
					</Layout>
				))}
				</tr>
			</thead>

			<tbody>
				{sortedItems.map((item) => (
					<tr key={keyFunc(item)}>{columns.map((c) => <Layout key={c.id} elementType="td" direction="row" display="table-cell" children={c.content(item)} {...tableDataProps} />)}</tr>
				))}
			</tbody>
		</Layout>
	);
}
