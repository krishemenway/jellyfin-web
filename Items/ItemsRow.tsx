import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import LinkToItem from "Items/LinkToItem";
import ItemImage from "Items/ItemImage";
import { createStyles } from "Common/AppStyles";
import ListOf from "Common/ListOf";
import Layout from "Common/Layout";

const ItemsRow: React.FC<{ items: BaseItemDto[], mx?: number, my?: number }> = (props) => {
	return (
		<ListOf
			items={props.items}
			createKey={(item, i) => item.Id ?? i.toString()}
			renderItem={(item) => <BaseItemDtoListItem item={item} />}
			listLayout={{ direction: "row", gap: 8, wrap: false, overflowX: "scroll", overflowY: "hidden", minWidth: "100%", mx: props.mx, my: props.my }}
		/>
	);
};

const BaseItemDtoListItem: React.FC<{ item: BaseItemDto }> = (props) => {
	const items = itemStyles();

	return (
		<LinkToItem direction="column" {...props}>
			<ItemImage className={items.itemImage} {...props} type="Primary" />
			<Layout direction="row" justifyContent="center" elementType="caption">{props.item.Name}</Layout>
		</LinkToItem>
	);
};

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
		maxHeight: "220px",
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

export default ItemsRow;
