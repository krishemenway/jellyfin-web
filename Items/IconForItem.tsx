import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { IconForItemKind } from "Items/IconForItemKind";

export const IconForItem : React.FC<{ item: BaseItemDto }&IconProps> = (props) => {
	return <IconForItemKind itemKind={props.item.Type} collectionType={props.item.CollectionType} {...props} />;
};
