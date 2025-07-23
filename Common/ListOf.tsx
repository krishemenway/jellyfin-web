import * as React from "react";
import { Layout, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

export interface BaseListProps extends StyleLayoutPropsWithRequiredDirection {
	emptyListView?: React.ReactNode;
	className?: string;
	key?: string;
}

export interface ListPropsOf<TItem> extends BaseListProps {
	items: readonly TItem[];
	forEachItem: (item: TItem, index: number) => React.ReactNode;
}

export function ListOf<TItem>(props: ListPropsOf<TItem>): React.ReactNode {
	if (!props.items || props.items.length === 0) {
		return props.emptyListView ?? <></>;
	}

	return (
		<Layout {...props}>
			{props.items.map((item, index) => props.forEachItem(item, index))}
		</Layout>
	);
}
