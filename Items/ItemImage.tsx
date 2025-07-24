import * as React from "react";
import { useComputed } from "@residualeffect/rereactor";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

export enum ImageShape {
	Portrait,
	Landscape,
	Square,
}

export const ItemImage: React.FC<{ className?: string, item: BaseItemDto, type: ImageType, maxWidth?: string|number, fillWidth?: number, fillHeight?: number }> = (props) => {
	const imageUrl = useComputed(() => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrl(props.item, props.type, { fillWidth: props.fillWidth, fillHeight: props.fillHeight}));

	return (
		<img
			className={props.className}
			src={imageUrl}
			alt={props.item.Name ?? undefined}
			style={{ maxWidth: props.maxWidth }}
		/>
	);
};
