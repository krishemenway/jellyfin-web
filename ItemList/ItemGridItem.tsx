import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { LinkToItem } from "Items/LinkToItem";
import { Layout } from "Common/Layout";

export const ItemsGridItem: React.FC<{ item: BaseItemDto; fallback?: BaseItemDto, imageType?: ImageType; shape: ImageShape; itemsPerRow: number }> = (props) => {
	const background = useBackgroundStyles();

	return (
		<LinkToItem
			item={props.item}
			className={`${background.button}`}
			direction="column"
			py=".5em" px=".5em" gap="1em"
			justifyContent="space-between" alignItems="center"
			width={{ itemsPerRow: props.itemsPerRow, gap: ".5em" }}
		>
			<ItemImage item={props.item} fallback={props.fallback} type={props.imageType ?? ImageType.Primary} lazy objectFit="cover" maxWidth="100%" grow />
			<Layout direction="column" py=".25em" textAlign="center">{props.item.Name}</Layout>
		</LinkToItem>
	);
};
