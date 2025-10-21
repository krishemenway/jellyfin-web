import * as React from "react";
import { Property } from "csstype";
import { Nullable } from "Common/MissingJavascriptFunctions";

export enum DimensionZLayers {
	Default = 0,
	Player = 5,
	Modal = 10,
}

export interface StyleLayoutPropsWithRequiredDirection extends StyleLayoutProps {
	direction: Property.FlexDirection;
}

export interface ItemsPerRow {
	itemsPerRow: number;
	gap?: Property.Gap;
}

export interface LayoutWithoutChildrenProps {
	display?: Property.Display;
	grow?: Property.FlexGrow|true;
	basis?: Property.FlexBasis;
	alignSelf?: Property.AlignSelf;
	justifySelf?: Property.JustifySelf;

	position?: Property.Position;
	top?: Property.Top,
	bottom?: Property.Bottom,
	right?: Property.Right,
	left?: Property.Left,
	zIndex?: Property.ZIndex,

	overflowY?: Property.OverflowY;
	overflowX?: Property.OverflowX;

	fontSize?: Property.FontSize;
	textAlign?: Property.TextAlign;
	textOverflow?: Property.TextOverflow;
	whiteSpace?: Property.WhiteSpace;

	mx?: Property.MarginLeft,
	my?: Property.MarginTop;

	px?: Property.PaddingLeft;
	py?: Property.PaddingTop;

	bw?: Property.BorderWidth;

	bt?: true;
	bb?: true;

	bl?: true;
	br?: true;

	minWidth?: Property.MinWidth;
	maxWidth?: Property.MaxWidth;
	width?: Property.Width|ItemsPerRow;

	minHeight?: Property.MinHeight;
	maxHeight?: Property.MaxHeight;
	height?: Property.Height;

	backgroundUrl?: string;
	backgroundColor?: Property.BackgroundColor;
	backgroundRepeat?: Property.BackgroundRepeat;
	backgroundSize?: Property.BackgroundSize;
}

export interface StyleLayoutProps extends LayoutWithoutChildrenProps {
	direction?: Property.FlexDirection;
	gap?: Property.Gap;
	alignItems?: Property.AlignItems;
	justifyContent?: Property.JustifyContent;
	wrap?: boolean;
}

interface LayoutParams extends StyleLayoutPropsWithRequiredDirection {
	className?: string;
	children?: React.ReactNode;
	elementType?: React.ElementType;

	draggable?: true;
	onDragStart?: (evt: React.DragEvent<HTMLElement>) => void;
	onDrop?: (evt: React.DragEvent<HTMLElement>) => void;
	onDragOver?: (evt: React.DragEvent<HTMLElement>) => void;
	onDragLeave?: (evt: React.DragEvent<HTMLElement>) => void;
}

function CalculateItemsPerRowPercentage(width?: number|string|ItemsPerRow) {
	if (width === undefined || typeof width === "string" || typeof width === "number") {
		return width;
	}

	if (width.itemsPerRow <= 0) {
		throw new Error("Invalid number of items per row");
	}

	return `calc(${100 / width.itemsPerRow}%${Nullable.HasValue(width.gap) ? ` - ${(width.itemsPerRow - 1)} * ${width.gap} / ${width.itemsPerRow}` : ""})`;
}

export function ApplyLayoutStyleProps(props?: Partial<StyleLayoutPropsWithRequiredDirection>): React.CSSProperties {
	return {
		display: props?.display ?? "flex",
		flexDirection: props?.direction,
		gap: props?.gap,
		flexGrow: props?.grow === true ? 1 : props?.grow,
		flexBasis: props?.basis,
		alignItems: props?.alignItems,
		alignSelf: props?.alignSelf,
		justifyContent: props?.justifyContent,
		flexWrap: props?.wrap ? "wrap" : "nowrap",
		position: props?.position,
		top: props?.top,
		bottom: props?.bottom,
		left: props?.left,
		right: props?.right,
		zIndex: props?.zIndex,

		overflowX: props?.overflowX,
		overflowY: props?.overflowY,

		fontSize: props?.fontSize,
		textAlign: props?.textAlign,
		textOverflow: props?.textOverflow,
		whiteSpace: props?.whiteSpace,

		marginTop: props?.my,
		marginBottom: props?.my,
		marginLeft: props?.mx,
		marginRight: props?.mx,
		paddingTop: props?.py,
		paddingBottom: props?.py,
		paddingLeft: props?.px,
		paddingRight: props?.px,
		borderWidth: props?.bw,
		borderTopStyle: props?.bt === true ? "solid" : undefined,
		borderBottomStyle: props?.bb === true ? "solid" : undefined,
		borderLeftStyle: props?.bl === true ? "solid" : undefined,
		borderRightStyle: props?.br === true ? "solid" : undefined,
		minWidth: props?.minWidth,
		maxWidth: props?.maxWidth,
		width: CalculateItemsPerRowPercentage(props?.width),
		minHeight: props?.minHeight,
		maxHeight: props?.maxHeight,
		height: props?.height,

		backgroundColor: props?.backgroundColor,
		backgroundImage: Nullable.Value(props?.backgroundUrl, undefined, (u) => `url('${u}')`),
		backgroundRepeat: props?.backgroundRepeat,
		backgroundSize: props?.backgroundSize,
	};
}

export const Layout: React.FC<LayoutParams> = (props) => {
	return React.createElement(props.elementType ?? "div", {
		className: props.className,
		style: ApplyLayoutStyleProps(props),
		onDragStart: props.onDragStart,
		onDrop: props.onDrop,
		onDragOver: props.onDragOver,
		onDragLeave: props.onDragLeave,
		draggable: props.draggable,
	}, props.children);
};
