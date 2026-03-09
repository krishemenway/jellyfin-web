import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";

export enum ImageShape {
	Portrait,
	Landscape,
	Square,
}

export const ItemImage: React.FC<{ className?: string, item: BaseItemDto, fallback?: BaseItemDto, type: ImageType, fillWidth?: number, fillHeight?: number; lazy?: boolean }&LayoutWithoutChildrenProps> = (props) => {
	const imageUrl = React.useMemo(() => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrl(props.item, props.type, { fillWidth: props.fillWidth, fillHeight: props.fillHeight}), [props.item, props.type, props.fillWidth, props.fillHeight]);
	const fallbackImageUrl = React.useMemo(() => Nullable.HasValue(props.fallback) ? getImageApi(ServerService.Instance.CurrentApi).getItemImageUrl(props.fallback, props.type, { fillWidth: props.fillWidth, fillHeight: props.fillHeight}) : "", [props.fallback, props.type, props.fillWidth, props.fillHeight]);
	const onImageLoadError = React.useCallback((evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
		if (evt.currentTarget.src !== fallbackImageUrl && Nullable.HasValue(fallbackImageUrl)) {
			evt.currentTarget.src = fallbackImageUrl;
		}
	}, [fallbackImageUrl]);

	return (
		<img
			className={props.className}
			src={imageUrl}
			alt={props.item.Name ?? undefined}
			style={ApplyLayoutStyleProps(props)}
			loading={props.lazy === true ? "lazy" : "eager"}
			onError={onImageLoadError}
		/>
	);
};
