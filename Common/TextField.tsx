import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { useBackgroundStyles } from "Common/AppStyles";
import { EditableField } from "Common/EditableField";
import { ApplyLayoutStyleProps } from "Common/Layout";

interface TextFieldProps {
	className?: string;

	field: EditableField;
	disabled?: boolean;

	px?: number;
	py?: number;

	onBlur?: () => void;
}

const ForwardedTextField: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const value = useObservable(props.field.Current);

	return (
		<input
			type="text"
			ref={ref}
			id={props.field.FieldId}
			className={props.className ?? background.field}
			value={value}
			onBlur={() => props.onBlur && props.onBlur()}
			onChange={(evt) => { props.field.OnChange(evt.currentTarget.value); }}
			autoFocus={true}
			disabled={props.disabled}
			style={ApplyLayoutStyleProps(props)}
		/>
	);
};

const TextField = React.forwardRef(ForwardedTextField);
export default TextField;
