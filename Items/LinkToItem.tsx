import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { HyperLink } from "Common/HyperLink";
import { ItemService } from "Items/ItemsService";

export const LinkToItem: React.FC<{ item: BaseItemDto; className?: string; children: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	return <HyperLink to={ItemService.UrlForItem(props.item)} {...props} />;
};
