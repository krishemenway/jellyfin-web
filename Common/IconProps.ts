import * as React from "react";

export interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
	size: string|number;
	color?: string;
	className?: string;
}

export function ApplyIconPropsToSvg(props: IconProps) {
	return {
		height: props.size,
		width: props.size,
		fill: props.color ?? "inherit",
		className: props.className,
	};
}
