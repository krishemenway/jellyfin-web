import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { createStyles, useBackgroundStyles } from "AppStyles";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { LinkToItem } from "Items/LinkToItem";
import { Layout } from "Common/Layout";


export const ItemsGridItem: React.FC<{ item: BaseItemDto; imageType?: ImageType; shape: ImageShape; itemsPerRow: number }> = (props) => {
	const background = useBackgroundStyles();
	const classes = useItemGridClasses();
	const width = props.shape !== ImageShape.Landscape ? 220 : 330;
	const height = props.shape !== ImageShape.Portrait ? 220 : 330;

	return (
		<LinkToItem item={props.item} className={`${background.button}`} direction="column" justifyContent="center" alignItems="center" py=".5em" px=".5em" gap="1em" width={{ itemsPerRow: props.itemsPerRow, gap: ".5em" }}>
			<ItemImage item={props.item} className={classes.itemImage} type={props.imageType ?? ImageType.Primary} fillWidth={width} fillHeight={height} lazy />
			<Layout direction="column" py=".25em" textAlign="center">{props.item.Name}</Layout>
		</LinkToItem>
	);
};

const useItemGridClasses = createStyles({
	itemImage: {
		maxWidth: "100%",
		objectFit: "contain",
	},
});
