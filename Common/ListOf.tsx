import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

export interface ListPropsOf<TItem> {
	items: readonly TItem[];
	renderItem: (item: TItem, index: number) => JSX.Element;
	createKey: (item: TItem, index: number) => string;
	emptyListView?: JSX.Element;

	key?: string;

	listLayout?: StyleLayoutPropsWithRequiredDirection;
	listItemLayout?: StyleLayoutPropsWithRequiredDirection;

	listClassName?: string;
	listItemClassName?: (first: boolean, last: boolean) => string;
}

function ListOf<TItem>(props: ListPropsOf<TItem>): JSX.Element {
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

export default ListOf;
