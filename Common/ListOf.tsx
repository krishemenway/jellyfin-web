import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

export interface ListStyleProps {
	listLayout?: StyleLayoutPropsWithRequiredDirection;
	listItemLayout?: StyleLayoutPropsWithRequiredDirection;

	listClassName?: string;
	listItemClassName?: (first: boolean, last: boolean) => string;
}

export interface ListPropsOf<TItem> extends ListStyleProps {
	items: readonly TItem[];
	renderItem: (item: TItem, index: number) => React.ReactNode;
	createKey: (item: TItem, index: number) => string;
	emptyListView?: JSX.Element;

	key?: string;
}

export function ListOf<TItem>(props: ListPropsOf<TItem>): JSX.Element {
	if (!props.items || props.items.length === 0) {
		return props.emptyListView ?? <></>;
	}

	return (
		<ol
			key={props.key}
			className={props.listClassName}
			style={ApplyLayoutStyleProps(props.listLayout)}>
			{props.items.map((item, index) => (
				<li
					key={props.createKey(item, index)}
					className={props.listItemClassName !== undefined ? props.listItemClassName(index === 0, index === props.items.length - 1) : ""}
					style={ApplyLayoutStyleProps(props.listItemLayout)}>
					{props.renderItem(item, index)}
				</li>
			))}
		</ol>
	);
}
