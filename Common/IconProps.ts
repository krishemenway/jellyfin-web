import * as React from "react";
import { Property } from "csstype";

export interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
	size: string|number;
	color?: string;
	className?: string;

	alignSelf?: Property.AlignSelf;

	my?: number|string;
	mx?: number|string;
}

export function ApplyIconPropsToSvg(props: IconProps): Partial<React.SVGProps<SVGSVGElement>> {
	return {
		height: props.size,
		width: props.size,
		fill: props.color ?? "inherit",
		className: props.className,
		style: {
			marginTop: props.my,
			marginBottom: props.my,
			marginLeft: props.mx,
			marginRight: props.mx,
			alignSelf: props.alignSelf,
		},
	};
}
