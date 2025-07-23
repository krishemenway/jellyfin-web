import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";

export const ItemStudios: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string }&BaseListProps> = (props) => {
	return (
		<ListOf
			items={props.item.Studios ?? []}
			forEachItem={(studio, index) => <HyperLink key={studio.Id ?? index.toString()} to={`/Studio/${studio.Id}`} direction="row" {...props.linkLayout} className={props.linkClassName}>{studio.Name}</HyperLink>}
			{...props}
		/>
	);
};
