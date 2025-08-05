import * as React from "react";
import { Property } from "csstype";
import { Nullable } from "./MissingJavascriptFunctions";

export interface StyleLayoutPropsWithRequiredDirection extends StyleLayoutProps {
	direction: Property.FlexDirection;
}

export interface PercentWidthWithGap {
	itemsPerRow: number;
	gap: number;
}

export interface LayoutWithoutChildrenProps {
	display?: Property.Display;
	grow?: Property.FlexGrow|true;
	basis?: Property.FlexBasis;
	alignSelf?: Property.AlignSelf;
	justifySelf?: Property.JustifySelf;

	position?: Property.Position;
	top?: number,
	bottom?: number,
	right?: number,
	left?: number,

	overflowY?: Property.OverflowY;
	overflowX?: Property.OverflowX;

	fontSize?: Property.FontSize;
	textAlign?: Property.TextAlign;
	textOverflow?: Property.TextOverflow;
	whiteSpace?: Property.WhiteSpace;

	mx?: number,
	my?: number;

	px?: number|string;
	py?: number|string;

	bw?: number;

	bt?: true;
	bb?: true;

	bl?: true;
	br?: true;

	minWidth?: number|string;
	maxWidth?: number|string;
	width?: number|string|PercentWidthWithGap;

	minHeight?: number|string;
	maxHeight?: number|string;
	height?: number|string;
}

export interface StyleLayoutProps extends LayoutWithoutChildrenProps {
	direction?: Property.FlexDirection;
	gap?: Property.Gap|number;
	alignItems?: Property.AlignItems;
	justifyContent?: Property.JustifyContent;
	wrap?: boolean;
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

	return `calc(100% / ${width.itemsPerRow} - ${(width.itemsPerRow - 1) * width.gap / width.itemsPerRow}px)`;
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
	};
}

export const Layout: React.FC<LayoutParams> = (props) => {
	return React.createElement(props.elementType ?? "div", { 
		className: props.className,
		style: ApplyLayoutStyleProps(props),
	}, props.children);
};
