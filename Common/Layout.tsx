import * as React from "react";
import { Property } from "csstype";

export interface StyleLayoutPropsWithRequiredDirection extends StyleLayoutProps {
	direction: "row" | "row-reverse" | "column" | "column-reverse";
}

export interface StyleLayoutProps {
	direction?: "row" | "row-reverse" | "column" | "column-reverse";
	gap?: number;
	alignItems?: "center"|"start"|"end";
	alignSelf?: "center"|"start"|"end";
	justifyContent?: "center"|"start"|"end"|"space-between";
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
	width?: number|string;
	widthByItemsPerRow?: number;

	minHeight?: number|string;
	maxHeight?: number|string;
	height?: number|string;
}

interface LayoutParams extends StyleLayoutPropsWithRequiredDirection {
	className?: string;
	children?: React.ReactNode;
	elementType?: React.ElementType;
}

const Layout: React.FC<LayoutParams> = (props) => {
	return React.createElement(props.elementType ?? "div", { 
		className: props.className,
		style: ApplyLayoutStyleProps(props),
	}, props.children);
};

function CalculateItemsPerRowPercentage(props?: Partial<StyleLayoutPropsWithRequiredDirection>) {
	if (props?.widthByItemsPerRow === undefined) {
		return undefined;
	}

	return `${100 / props.widthByItemsPerRow}%`;
}

export function ApplyLayoutStyleProps(props?: Partial<StyleLayoutPropsWithRequiredDirection>): React.CSSProperties {
	return {
		display: "flex",
		flexDirection: props?.direction,
		gap: props?.gap,
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
		borderTopStyle: !!props?.bt ? "solid" : undefined,
		borderBottomStyle: !!props?.bb ? "solid" : undefined,
		borderLeftStyle: !!props?.bl ? "solid" : undefined,
		borderRightStyle: !!props?.br ? "solid" : undefined,
		minWidth: props?.minWidth,
		maxWidth: props?.maxWidth,
		width: props?.width ?? CalculateItemsPerRowPercentage(props),
		minHeight: props?.minHeight,
		maxHeight: props?.maxHeight,
		height: props?.height,
		fontSize: props?.fontSize,
	};
}

export default Layout;
