import * as React from "react";
import { Layout, StyleLayoutProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { Button } from "Common/Button";
import { Nullable } from "./MissingJavascriptFunctions";
import { TranslatedText } from "./TranslatedText";

export interface BaseListProps extends StyleLayoutPropsWithRequiredDirection {
	showMoreLimit?: number;
	showMoreButtonStyles?: StyleLayoutProps;
	emptyListView?: React.ReactNode;
	className?: string;
	key?: string;
}

export interface ListPropsOf<TItem> extends BaseListProps {
	items: readonly TItem[];
	forEachItem: (item: TItem, index: number) => React.ReactNode;
}

export function ListOf<TItem>(props: ListPropsOf<TItem>): React.ReactNode {
	const [showMore, setShowMore] = React.useState(false);

	if (!props.items || props.items.length === 0) {
		return props.emptyListView ?? <></>;
	}

	return (
		<Layout {...props}>
			{props.items.map((item, index) => props.forEachItem(item, index)).slice(0, showMore ? undefined : props.showMoreLimit)}
			{Nullable.Value(props.showMoreLimit, <></>, (limit) => !showMore && props.items.length > limit && <Button {...props.showMoreButtonStyles} type="button" onClick={() => { setShowMore(true); }}>+{props.items.length - limit} <TranslatedText textKey="ButtonMore" /></Button>)}
		</Layout>
	);
}
