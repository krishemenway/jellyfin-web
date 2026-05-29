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
	return <ItemImageById itemId={props.item.Id!} fallbackId={props.fallback?.Id} altText={props.item.Name ?? ""} {...props} />;
};

export const ItemImageById: React.FC<{ className?: string, itemId: string, fallbackId?: string, altText: string, type: ImageType, fillWidth?: number, fillHeight?: number; lazy?: boolean }&LayoutWithoutChildrenProps> = (props) => {
	const imageUrl = React.useMemo(() => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrlById(props.itemId, props.type, { fillWidth: props.fillWidth, fillHeight: props.fillHeight}), [props.itemId, props.type, props.fillWidth, props.fillHeight]);
	const fallbackImageUrl = React.useMemo(() => Nullable.Value(props.fallbackId, "", (fid) => getImageApi(ServerService.Instance.CurrentApi).getItemImageUrlById(fid, props.type, { fillWidth: props.fillWidth, fillHeight: props.fillHeight})), [props.fallbackId, props.type, props.fillWidth, props.fillHeight]);
	const onImageLoadError = React.useCallback((evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
		if (evt.currentTarget.src !== fallbackImageUrl && Nullable.HasValue(fallbackImageUrl)) {
			evt.currentTarget.src = fallbackImageUrl;
		}
	}, [fallbackImageUrl]);

	return (
		<img
			className={props.className}
			src={imageUrl}
			alt={props.altText}
			style={ApplyLayoutStyleProps(props)}
			loading={props.lazy === true ? "lazy" : "eager"}
			onError={onImageLoadError}
		/>
	);
};
