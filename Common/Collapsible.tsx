import * as React from "react";

export interface CollapsibleProps {
	open: boolean;
	children: React.ReactNode;
}

export const Collapsible: React.FC<CollapsibleProps> = (props) => {
	return (
		<>{props.open && React.Children.map(props.children, (c) => c)}</>
	);
}
