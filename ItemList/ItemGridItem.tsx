import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { ItemImage } from "Items/ItemImage";
import { LinkToItem } from "Items/LinkToItem";
import { Layout, LayoutWithoutChildrenProps } from "Common/Layout";
import { SortFuncs } from "Common/Sort";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { PlaylistDragItemsFunc } from "MediaPlayer/MediaPlayerPlaylist";
import { ItemPlayedMarker } from "Items/ItemPlayedMarker";

interface ItemsGridItemProps {
	item: BaseItemDto;
	fallback?: BaseItemDto;
	imageType?: ImageType;
	itemsPerRow: number;
	additionalFields?: readonly SortFuncs<BaseItemDto>[];
	getContent?: (item: BaseItemDto) => string|undefined;
}

export const ItemsGridItem: React.FC<ItemsGridItemProps> = ({ item, fallback, imageType, itemsPerRow, additionalFields, getContent }) => {
	const background = useBackgroundStyles();

	return (
		<LinkToItem
			item={item}
			className={`${background.button}`}
			direction="column" position="relative"
			py=".5em" px=".5em" gap=".25em"
			justifyContent="space-between" alignItems="center"
			width={{ itemsPerRow: itemsPerRow, gap: ".5em" }}
			onDragStart={PlaylistDragItemsFunc(() => [item])}
		>
			<ItemPlayedMarker item={item} />
			<ItemImage item={item} fallback={fallback} type={imageType ?? ImageType.Primary} lazy objectFit="cover" maxWidth="100%" grow />
			<GridItemField item={item} getContent={getContent ?? ((i) => i.Name)} />
			{(additionalFields ?? []).filter((f) => !f.Hidden).map((s) => <GridItemField key={`${item.Id + s.LabelKey}`} item={item} getContent={s.GetContent} fontSizeREM={.9} fontColor="Secondary" />)}
		</LinkToItem>
	);
};

const GridItemField: React.FC<{ item: BaseItemDto; getContent: (item: BaseItemDto) => string|undefined|null; }&LayoutWithoutChildrenProps> = (props) => {
	const content = React.useMemo(() => props.getContent(props.item), [props.item, props.getContent]);
	return <Layout direction="column" textAlign="center" {...props}>{Nullable.StringValue(content, "—")}</Layout>;
};
