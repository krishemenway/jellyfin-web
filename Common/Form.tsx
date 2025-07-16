import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

const Form: React.FC<{ onSubmit: () => void; className?: string; children?: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	return (
		<form className={props.className} style={ApplyLayoutStyleProps(props)} onSubmit={(evt) => { evt.preventDefault(); props.onSubmit(); return false; }}>
			{React.Children.map(props.children, (c) => c)}
		</form>
	);
};

export default Form;
