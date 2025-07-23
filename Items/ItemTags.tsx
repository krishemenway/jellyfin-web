import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";

export const ItemTags: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string }&BaseListProps> = (props) => {
	return (
		<ListOf
			items={props.item.Tags ?? []}
			forEachItem={(tag) => <HyperLink key={tag} to={`/Tags/${tag}`} direction="row" {...props.linkLayout} className={props.linkClassName}>{tag}</HyperLink>}
			{...props}
		/>
	);
};
