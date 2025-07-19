import * as React from "react";
import { Property } from "csstype";

export interface StyleLayoutPropsWithRequiredDirection extends StyleLayoutProps {
	direction: Property.FlexDirection;
}

export interface PercentWidthWithGap {
	itemsPerRow: number;
	gap: number;
}

export interface StyleLayoutProps {
	direction?: Property.FlexDirection;
	gap?: Property.Gap|number;
	grow?: Property.FlexGrow;

	alignItems?: Property.AlignItems;
	alignSelf?: Property.AlignSelf;
	justifyContent?: Property.JustifyContent;
	wrap?: boolean;

	position?: Property.Position;
	top?: number,
	bottom?: number,
	right?: number,
	left?: number,

	overflowY?: Property.OverflowY;
	overflowX?: Property.OverflowX;

	fontSize?: Property.FontSize;

	mx?: number,
	my?: number;

	px?: number|string;
	py?: number|string;

	bw?: number;

	bt?: boolean;
	bb?: boolean;

	bl?: boolean;
	br?: boolean;

	minWidth?: number|string;
	maxWidth?: number|string;
	width?: number|string|PercentWidthWithGap;

	minHeight?: number|string;
	maxHeight?: number|string;
	height?: number|string;
}

interface LayoutParams extends StyleLayoutPropsWithRequiredDirection {
	className?: string;
	children?: React.ReactNode;
	elementType?: React.ElementType;
}

function CalculateItemsPerRowPercentage(width?: number|string|PercentWidthWithGap) {
	if (width === undefined || typeof width === "string" || typeof width === "number") {
		return width;
	}

	if (width.itemsPerRow <= 0) {
		throw new Error("Invalid number of items per row");
	}

	return `calc((100% - ${(width.itemsPerRow) * width.gap}px) / ${width.itemsPerRow})`;
}

export function ApplyLayoutStyleProps(props?: Partial<StyleLayoutPropsWithRequiredDirection>): React.CSSProperties {
	return {
		display: "flex",
		flexDirection: props?.direction,
		gap: props?.gap,
		flexGrow: props?.grow,
		alignItems: props?.alignItems,
		alignSelf: props?.alignSelf,
		justifyContent: props?.justifyContent,
		flexWrap: props?.wrap ? "wrap" : "nowrap",
		position: props?.position,
		top: props?.top,
		bottom: props?.bottom,
		left: props?.left,
		right: props?.right,
		overflowY: props?.overflowY,
		overflowX: props?.overflowX,
		marginTop: props?.my,
		marginBottom: props?.my,
		marginLeft: props?.mx,
		marginRight: props?.mx,
		paddingTop: props?.py,
		paddingBottom: props?.py,
		paddingLeft: props?.px,
		paddingRight: props?.px,
		borderWidth: props?.bw,
		borderTopStyle: !props?.bt ? undefined : "solid",
		borderBottomStyle: !props?.bb ? undefined : "solid",
		borderLeftStyle: !props?.bl ? undefined : "solid",
		borderRightStyle: !props?.br ? undefined : "solid",
		minWidth: props?.minWidth,
		maxWidth: props?.maxWidth,
		width: CalculateItemsPerRowPercentage(props?.width),
		minHeight: props?.minHeight,
		maxHeight: props?.maxHeight,
		height: props?.height,
		fontSize: props?.fontSize,
	};
}

export const Layout: React.FC<LayoutParams> = (props) => {
	return React.createElement(props.elementType ?? "div", { 
		className: props.className,
		style: ApplyLayoutStyleProps(props),
	}, props.children);
};
