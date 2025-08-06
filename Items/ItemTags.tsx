import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { TagLink } from "Tags/TagLink";

export const ItemTags: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string }&BaseListProps> = (props) => {
	return (
		<ListOf
			items={props.item.Tags ?? []}
			forEachItem={(tag) => <TagLink key={tag} tag={tag} direction="row" {...props.linkLayout} className={props.linkClassName} />}
			{...props}
		/>
	);
};
