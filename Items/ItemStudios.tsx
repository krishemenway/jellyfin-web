import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, ListStyleProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";

export const ItemStudios: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string }&ListStyleProps> = (props) => {
	return (
		<ListOf
			items={props.item.Studios ?? []}
			createKey={(studio, index) => studio.Id ?? index.toString()}
			renderItem={(studio) => <HyperLink to={`/Studio/${studio.Id}`} direction="row" {...props.linkLayout} className={props.linkClassName}>{studio.Name}</HyperLink>}
			{...props}
		/>
	);
};
