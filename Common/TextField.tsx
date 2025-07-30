import * as React from "react";
import { Property } from "csstype";
import { useObservable } from "@residualeffect/rereactor";
import { useBackgroundStyles } from "AppStyles";
import { EditableField } from "Common/EditableField";
import { ApplyLayoutStyleProps } from "Common/Layout";

interface TextFieldProps {
	className?: string;

	field: EditableField;
	disabled?: boolean;
	password?: boolean;

	px?: Property.PaddingLeft|number;
	py?: Property.PaddingTop|number;

	onBlur?: () => void;
}

const ForwardedTextField: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const currentValue = useObservable(props.field.Current);

	return (
		<input
			type={props.password === true ? "password" : "text"}
			ref={ref}
			id={props.field.FieldId}
			className={props.className ?? background.field}
			value={currentValue}
			onBlur={() => props.onBlur && props.onBlur()}
			onChange={(evt) => { props.field.OnChange(evt.currentTarget.value); }}
			autoFocus={true}
			disabled={props.disabled}
			style={ApplyLayoutStyleProps(props)}
		/>
	);
};

export const TextField = React.forwardRef(ForwardedTextField);
