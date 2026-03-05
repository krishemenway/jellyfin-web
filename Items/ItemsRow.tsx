import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { LinkToItem } from "Items/LinkToItem";
import { ItemImage } from "Items/ItemImage";
import { useBackgroundStyles, useBreakpointValue, ResponsiveBreakpoint } from "AppStyles";
import { Layout } from "Common/Layout";

interface ItemsRowProps {
	items: BaseItemDto[];
	itemName: (item: BaseItemDto) => React.ReactNode;
}

const itemsPerRowConfig = { [ResponsiveBreakpoint.Mobile]: 2, [ResponsiveBreakpoint.Tablet]: 3, [ResponsiveBreakpoint.Desktop]: 5, [ResponsiveBreakpoint.Wide]: 7 };

export const ItemsRow: React.FC<ItemsRowProps> = (props) => {
	const background = useBackgroundStyles();
	const itemsPerRow = useBreakpointValue(itemsPerRowConfig);

	return (
		<Layout direction="row" px=".5em" py=".5em" gap=".5em" wrap className={background.panel}>
			{props.items.map((item) => (
				<LinkToItem key={item.Id} item={item} className={background.transparent} direction="column" gap=".25em" width={{ itemsPerRow: itemsPerRow, gap: ".5em" }}>
					<Layout direction="column" width="100%"><ItemImage item={item} width="inherit" type="Primary" /></Layout>
					<Layout direction="row" textAlign="center" justifyContent="center" alignItems="end" py=".5em" grow elementType="p">{props.itemName(item)}</Layout>
				</LinkToItem>
			))}
		</Layout>
	);
};
