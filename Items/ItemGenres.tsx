import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, ListStyleProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";

export const ItemGenres: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string }&ListStyleProps> = (props) => {
	return (
		<ListOf
			items={props.item.Genres ?? []}
			createKey={(genre) => genre}
			renderItem={(genre) => <HyperLink to={`/Genres/${genre}`} direction="row" {...props.linkLayout} className={props.linkClassName}>{genre}</HyperLink>}
			{...props}
		/>
	);
};
