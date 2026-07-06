import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

interface FormProps extends StyleLayoutPropsWithRequiredDirection {
	onSubmit: () => void;
	classes?: string[];
	children?: React.ReactNode;
	autoComplete?: boolean;
}

export const Form: React.FC<FormProps> = ({ classes, onSubmit, children, autoComplete, ...props }) => {
	return (
		<form
			autoComplete={autoComplete === true ? "on" : "off"}
			className={classes?.join(" ")}
			style={ApplyLayoutStyleProps(props)}
			children={children}
			onSubmit={(evt) => { evt.preventDefault(); onSubmit(); return false; }}
		/>
	);
};
