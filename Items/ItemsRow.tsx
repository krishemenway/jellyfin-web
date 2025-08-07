import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { LinkToItem } from "Items/LinkToItem";
import { ItemImage } from "Items/ItemImage";
import { createStyles, useBackgroundStyles } from "AppStyles";
import { Layout } from "Common/Layout";

interface ItemsRowProps {
	items: BaseItemDto[];
	itemName: (item: BaseItemDto) => React.ReactNode;
}

const itemStyles = createStyles({
	banner: { },
	portrait: {
		position: "relative",
		flexGrow: 1,
		maxHeight: "330px",
	},
	square: { },

	itemGrid: {
		gap: 16,
	},

	itemImage: {
		maxHeight: "340px",
		objectFit: "contain",
	},

	"@media (min-width: 75em)": {
		portrait: { width: "16.666666666666666666666666666667%", },
		square: { width: "16.666666666666666666666666666667%", },
		banner: { width: "33.333333333333333333333333333333%", },
	},
	"@media (min-width: 87.5em)": {
		portrait: { width: "14.285714285714285714285714285714%", },
		square: { width: "14.285714285714285714285714285714%", },
	},
	"@media (min-width: 100em)": {
		portrait: { width: "12.5%", },
		square: { width: "12.5%", },
	},
	"@media (min-width: 120em)": {
		portrait: { width: "11.111111111111111111111111111111%", },
		square: { width: "11.111111111111111111111111111111%", },
	},
	"@media (min-width: 131.25em)": {
		banner: { width: "25%", },
		square: { width: "10%", },
		portrait: { width: "10%", },
	},
	"@media (min-width: 156.25em)": {
		backdrop: { width: "16.666666666666666666666666666667%", },
	},
});

export const ItemsRow: React.FC<ItemsRowProps> = (props) => {
	const items = itemStyles();
	const background = useBackgroundStyles();

	return (
		<Layout direction="row" px=".5em" py=".5em" gap={8} wrap className={background.panel}>
			{props.items.map((item) => (
				<LinkToItem key={item.Id} item={item} className={background.button} direction="column" gap={4} width={{ itemsPerRow: 7, gap: 8 }}>
					<ItemImage item={item} className={items.itemImage} type="Primary" />
					<Layout direction="row" textAlign="center" justifyContent="center" alignItems="end" py=".5em" grow elementType="p">{props.itemName(item)}</Layout>
				</LinkToItem>
			))}
		</Layout>
	);
};
