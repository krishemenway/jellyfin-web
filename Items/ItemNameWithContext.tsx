import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export const ItemNameWithContext : React.FC<{ item?: BaseItemDto }> = (props) => {
	switch (props.item?.Type) {
		case "CollectionFolder":
			switch(props.item.CollectionType) {
				default: return props.item?.Name;
			}
		case "Episode": return `${props.item.SeriesName} - ${props.item.Name}`;
		default: return props.item?.Name;
	}
};
