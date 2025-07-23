import * as React from "react";
import { LinkToItem } from "Items/LinkToItem";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { ItemImage } from "Items/ItemImage";
import { createStyles, useBackgroundStyles } from "Common/AppStyles";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { ItemListService } from "ItemList/ItemListService";
import { useObservable } from "@residualeffect/rereactor";

export const ItemsGrid: React.FC<{ service: ItemListService; imageType?: ImageType }> = (props) => {
	const background = useBackgroundStyles();
	const classes = useItemGridClasses();
	const items = useObservable(props.service.FilteredAndSortedItems);
	
	return (
		<ListOf
			items={items}
			direction="row" wrap gap={16}
			forEachItem={(item, index) => (
				<LinkToItem key={item.Id ?? index.toString()} item={item} className={`${background.transparent} ${classes.portrait}`} direction="column" justifyContent="center" alignItems="center" py={8} px={8}>
					<ItemImage item={item} className={classes.itemImage} type={props.imageType ?? ImageType.Primary} />
					<Layout direction="row" py={4}>{item.Name}</Layout>
				</LinkToItem>
			)}
		/>
	);
};

const useItemGridClasses = createStyles({
	banner: { },
	portrait: {
		position: "relative",
		flexGrow: 1,
		maxHeight: "330px",
	},
	square: { },

	itemImage: {
		minHeight: "200px",
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
