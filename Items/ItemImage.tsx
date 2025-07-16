import * as React from "react";
import { useComputed } from "@residualeffect/rereactor";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

const ItemImage: React.FC<{ className?: string, item: BaseItemDto, type: ImageType }> = (props) => {
	const imageUrl = useComputed(() => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrl(props.item, props.type));

	return (
		<img
			className={props.className}
			src={imageUrl}
			alt={props.item.Name ?? undefined}
		/>
	)
}

export default ItemImage;