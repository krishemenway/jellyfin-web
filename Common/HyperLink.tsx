import * as React from "react";
import { Link } from "react-router-dom";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface HyperLinkProps extends StyleLayoutPropsWithRequiredDirection {
	to: string;
	className?: string;
	children?: React.ReactNode;
	onClick?: () => void;
	onDragStart?: (evt: React.DragEvent<HTMLElement>) => void;
}

export const HyperLink: React.FC<HyperLinkProps> = ({ to, className, children, onClick, onDragStart, ...props}) => {
	const background = useBackgroundStyles();

	return (
		<Link
			to={to}
			className={className ?? background.transparent}
			children={children}
			style={ApplyLayoutStyleProps(props)}
			onClick={() => { Nullable.TryExecute(onClick, (handler) => handler()); }}
			onDragStart={onDragStart}
		/>
	);
}
