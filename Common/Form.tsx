import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

export const Form: React.FC<{ onSubmit: () => void; classes?: string[]; children?: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	return (
		<form className={props.classes?.join(" ")} style={ApplyLayoutStyleProps(props)} onSubmit={(evt) => { evt.preventDefault(); props.onSubmit(); return false; }}>
			{React.Children.map(props.children, (c) => c)}
		</form>
	);
};
