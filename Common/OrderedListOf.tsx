import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { ListPropsOf } from "Common/ListOf";
import { Nullable } from "./MissingJavascriptFunctions";

export interface OrderedListStyleProps {
	listItemLayout?: StyleLayoutPropsWithRequiredDirection;
	listItemClasses?: (first: boolean, last: boolean) => string[];
}

export interface OrderedListOfProps<TItem> extends ListPropsOf<TItem>, OrderedListStyleProps {
	createKey: (item: TItem, index: number) => string;
}

export function OrderedListOf<TItem>(props: OrderedListOfProps<TItem>): React.ReactNode {
	if (!props.items || props.items.length === 0) {
		return props.emptyListView ?? <></>;
	}

	return (
		<ol
			key={props.key}
			className={props.classes?.join(" ")}
			style={ApplyLayoutStyleProps(props)}>
			{props.items.map((item, index) => (
				<li
					key={props.createKey(item, index)}
					className={Nullable.Value(props.listItemClasses, undefined, (classes) => classes(index === 0, index === props.items.length - 1).join(" "))}
					style={ApplyLayoutStyleProps(props.listItemLayout)}>
					{props.forEachItem(item, index)}
				</li>
			))}
		</ol>
	);
}
