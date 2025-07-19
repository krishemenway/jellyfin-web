import * as React from "react";
import { useComputed } from "@residualeffect/rereactor";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

export const ItemImage: React.FC<{ className?: string, item: BaseItemDto, type: ImageType, width?: string|number, maxWidth?: string|number }> = (props) => {
	const imageUrl = useComputed(() => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrl(props.item, props.type));

	return (
		<img
			className={props.className}
			src={imageUrl}
			alt={props.item.Name ?? undefined}
			style={{ width: props.width, maxWidth: props.maxWidth }}
		/>
	);
};
