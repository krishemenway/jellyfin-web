import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf, ListStyleProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { StyleLayoutProps } from "Common/Layout";

export const ItemExternalLinks: React.FC<{ item: BaseItemDto, linkLayout?: StyleLayoutProps, linkClassName?: string }&ListStyleProps> = (props) => {
	return (
		<ListOf
			items={props.item.ExternalUrls ?? []}
			createKey={(url, i) => url.Name ?? i.toString()}
			renderItem={(url) => <HyperLink to={url.Url ?? "/NotFound"} direction="row" {...props.linkLayout} className={props.linkClassName}>{url.Name}</HyperLink>}
			{...props}
		/>
	);
};
