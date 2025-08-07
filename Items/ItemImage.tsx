import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";

export enum ImageShape {
	Portrait,
	Landscape,
	Square,
}

export const ItemImage: React.FC<{ className?: string, item: BaseItemDto, type: ImageType, fillWidth?: number, fillHeight?: number; lazy?: boolean }&LayoutWithoutChildrenProps> = (props) => {
	const imageUrl = React.useMemo(() => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrl(props.item, props.type, { fillWidth: props.fillWidth, fillHeight: props.fillHeight}), [props.item, props.type, props.fillWidth, props.fillHeight]);

	return (
		<img
			className={props.className}
			src={imageUrl}
			alt={props.item.Name ?? undefined}
			style={ApplyLayoutStyleProps(props)}
			loading={props.lazy === true ? "lazy" : "eager"}
		/>
	);
};
