import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { LinkToItem } from "Items/LinkToItem";
import { Layout } from "Common/Layout";
import { SortFuncs } from "Common/Sort";
import { Nullable } from "Common/MissingJavascriptFunctions";

export const ItemsGridItem: React.FC<{ item: BaseItemDto; fallback?: BaseItemDto, imageType?: ImageType; shape: ImageShape; itemsPerRow: number; additionalFields?: readonly SortFuncs<BaseItemDto>[]; }> = (props) => {
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
			<GridItemField item={props.item} getContent={(i) => i.Name} />
			{(props.additionalFields ?? []).map((s) => <GridItemField key={`${props.item.Id + s.LabelKey}`} item={props.item} getContent={s.GetContent} />)}
		</LinkToItem>
	);
};

const GridItemField: React.FC<{ item: BaseItemDto; getContent: (item: BaseItemDto) => string|undefined|null; }> = (props) => {
	const content = React.useMemo(() => props.getContent(props.item), [props.item, props.getContent]);
	return <Layout direction="column" py=".25em" textAlign="center">{Nullable.StringHasValue(content) ? content : "-"}</Layout>;
};
