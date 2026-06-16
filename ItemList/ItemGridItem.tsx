import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { ItemImage } from "Items/ItemImage";
import { LinkToItem } from "Items/LinkToItem";
import { Layout, LayoutWithoutChildrenProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { PlaylistDragItemsFunc } from "MediaPlayer/MediaPlayerPlaylist";
import { ItemPlayedMarker } from "Items/ItemPlayedMarker";
import { ItemSortTypeModel } from "ItemList/ItemSortTypeModel";
import { useObservable } from "@residualeffect/rereactor";
import { defaultNameFunc } from "Items/BaseItemKindServiceFactory";

interface ItemsGridItemProps {
	item: BaseItemDto;
	fallback?: BaseItemDto;
	imageType?: ImageType;
	itemsPerRow: number;
	additionalFields?: readonly ItemSortTypeModel[];
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
			<GridItemField item={item} getContent={getContent ?? defaultNameFunc} />
			{(additionalFields ?? []).map((sortTypeModel) => <AdditionalField key={sortTypeModel.Key} sortTypeModel={sortTypeModel} item={item} fontSizeREM={.9} fontColor="Secondary" />)}
		</LinkToItem>
	);
};

const AdditionalField: React.FC<{ sortTypeModel: ItemSortTypeModel; item: BaseItemDto; }&LayoutWithoutChildrenProps> = ({ sortTypeModel, ...props }) => {
	const hidden = useObservable(sortTypeModel.ContentHidden.Current);

	if (hidden) {
		return <></>;
	}

	return <GridItemField getContent={sortTypeModel.SortType.getContent} {...props} />
}

const GridItemField: React.FC<{ item: BaseItemDto; getContent: (item: BaseItemDto) => string|undefined|null; }&LayoutWithoutChildrenProps> = ({ item, getContent, ...props }) => {
	const content = React.useMemo(() => getContent(item), [item, getContent]);
	return <Layout direction="column" textAlign="center" {...props}>{Nullable.StringValue(content, "—")}</Layout>;
};
