import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import HyperLink from "Common/HyperLink";
import { ItemService } from "Items/ItemsService";

const LinkToItem: React.FC<{ item: BaseItemDto; children: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	return <HyperLink to={ItemService.UrlForItem(props.item)} {...props} />;
};

export default LinkToItem;
