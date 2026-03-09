import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { LinkToItem } from "Items/LinkToItem";
import { Layout } from "Common/Layout";

export const ItemsGridItem: React.FC<{ item: BaseItemDto; library: BaseItemDto, imageType?: ImageType; shape: ImageShape; itemsPerRow: number }> = (props) => {
	const background = useBackgroundStyles();
	const width = props.shape !== ImageShape.Landscape ? 220 : 330;
	const height = props.shape !== ImageShape.Portrait ? 220 : 330;

	return (
		<LinkToItem
			item={props.item}
			className={`${background.button}`}
			direction="column"
			py=".5em" px=".5em" gap="1em"
			justifyContent="space-between" alignItems="center"
			width={{ itemsPerRow: props.itemsPerRow, gap: ".5em" }}
		>
			<ItemImage item={props.item} fallback={props.library} type={props.imageType ?? ImageType.Primary} fillWidth={width} fillHeight={height} lazy objectFit="cover" maxWidth="100%" grow />
			<Layout direction="column" py=".25em" textAlign="center">{props.item.Name}</Layout>
		</LinkToItem>
	);
};
