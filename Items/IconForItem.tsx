import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps, ApplyIconPropsToSvg } from "Common/IconProps";
import IconForItemType from "Items/IconForItemType";

const IconForItem : React.FC<{ item: BaseItemDto }&IconProps> = (props) => {
	return <IconForItemType itemType={props.item.Type} collectionType={props.item.CollectionType} {...props} />;
}

export default IconForItem;
