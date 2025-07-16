import * as React from "react";
import LinkToItem from "Items/LinkToItem";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import ItemImage from "Items/ItemImage";
import { createStyles } from "Common/AppStyles";
import ListOf from "Common/ListOf";

const ItemsGrid: React.FC<{ items: BaseItemDto[], imageType?: ImageType }> = (props) => {
	const classes = useItemGridClasses();

	return (
		<ListOf
			items={props.items}
			createKey={(item, i) => item.Id ?? i.toString()}
			listLayout={{ direction: "row", wrap: true, gap: 16 }}
			listItemClassName={() => classes.portrait}
			listItemLayout={{ direction: "column", alignItems: "center", justifyContent: "center" }}
			renderItem={(item) => (
				<LinkToItem item={item} direction="column" justifyContent="center" alignItems="center">
					<ItemImage item={item} className={classes.itemImage} type={props.imageType ?? ImageType.Primary} />
					<span>{item.Name}</span>
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

export default ItemsGrid;
