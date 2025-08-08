import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { useBackgroundStyles } from "AppStyles";
import { EditableField } from "Common/EditableField";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface TextFieldProps extends BaseInputFieldProps {
	field: EditableField;
}

interface InputFieldProps extends BaseInputFieldProps {
	id: string;
	value: string;
	onChange: (newValue: string) => void;
}

interface BaseInputFieldProps extends LayoutWithoutChildrenProps {
	className?: string;

	disabled?: boolean;
	password?: boolean;

	placeholder?: TranslationRequest;

	onBlur?: () => void;
}

const ForwardedTextField: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return <InputField id={props.field.FieldId} value={currentValue} onChange={(newValue) => props.field.OnChange(newValue)} ref={ref} />;
};

const ForwardedInputField: React.ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const placeholder = Nullable.ValueOrDefault(props.placeholder, undefined, (p) => useTranslatedText(p));

	return (
		<input
			type={props.password === true ? "password" : "text"}
			ref={ref}
			id={props.id}
			className={props.className ?? background.field}
			value={props.value}
			onBlur={() => props.onBlur && props.onBlur()}
			onChange={(evt) => { props.onChange(evt.currentTarget.value); }}
			autoFocus={true}
			disabled={props.disabled}
			style={ApplyLayoutStyleProps(props)}
			placeholder={placeholder}
		/>
	);
};

export const InputField = React.forwardRef(ForwardedInputField);
export const TextField = React.forwardRef(ForwardedTextField);
