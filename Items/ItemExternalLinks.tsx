import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { StyleLayoutProps } from "Common/Layout";

export const ItemExternalLinks: React.FC<{ item: BaseItemDto, linkLayout?: StyleLayoutProps, linkClassName?: string }&BaseListProps> = (props) => {
	return (
		<ListOf
			items={props.item.ExternalUrls ?? []}
			forEachItem={(url, index) => <HyperLink key={url.Url ?? index.toString()} to={url.Url ?? "/NotFound"} direction="row" {...props.linkLayout} className={props.linkClassName}>{url.Name}</HyperLink>}
			{...props}
		/>
	);
};
