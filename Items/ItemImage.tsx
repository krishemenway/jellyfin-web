import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { LayoutWithoutChildrenProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Image } from "Common/Image";

export enum ImageShape {
	Portrait,
	Landscape,
	Square,
}

interface BaseItemImageProps extends LayoutWithoutChildrenProps {
	type: ImageType;

	fillWidth?: number;
	fillHeight?: number;

	classes?: string[];
	lazy?: boolean;
}

interface ItemImageProps extends BaseItemImageProps {
	item: BaseItemDto;
	fallback?: BaseItemDto;
}

export const ItemImage: React.FC<ItemImageProps> = (props) => {
	return <ItemImageById itemId={props.item.Id!} fallbackId={props.fallback?.Id} altText={props.item.Name ?? ""} tag={Nullable.Value(props.item.ImageTags, undefined, (tags) => tags[props.type])} {...props} />;
};

interface ItemImageByIdProps extends BaseItemImageProps {
	itemId: string;
	fallbackId?: string;
	altText: string;
	tag?: string;
}

export const ItemImageById: React.FC<ItemImageByIdProps> = ({ classes, lazy, itemId, fallbackId, altText, type, fillWidth, fillHeight, tag, ...layoutStyleProps }) => {
	const service = React.useMemo(() => getImageApi(ServerService.Instance.CurrentApi), []);
	const imageUrl = React.useMemo(() => service.getItemImageUrlById(itemId, type, { fillWidth: fillWidth, fillHeight: fillHeight, tag: tag }), [itemId, type, fillWidth, fillHeight, tag]);
	const fallbackImageUrl = React.useMemo(() => Nullable.Value(fallbackId, "", (fid) => service.getItemImageUrlById(fid, type, { fillWidth: fillWidth, fillHeight: fillHeight})), [fallbackId, type, fillWidth, fillHeight, tag]);

	return (
		<Image
			url={imageUrl}
			fallbackUrls={[fallbackImageUrl]}
			altText={altText}
			lazy={lazy}
			classes={classes}
			{...layoutStyleProps}
		/>
	);
};
