import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { useBackgroundStyles } from "AppStyles";
import { EditableField } from "Common/EditableField";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface TextFieldProps extends BaseInputFieldProps {
	field: EditableField;
	multiLine?: boolean;
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
	return <InputField {...props} id={props.field.FieldId} value={currentValue} onChange={(newValue) => props.field.OnChange(newValue)} ref={ref} />;
};

const ForwardedMultiLineField: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return <TextAreaField {...props} id={props.field.FieldId} value={currentValue} onChange={(newValue) => props.field.OnChange(newValue)} ref={ref} />;
};

const ForwardedInputField: React.ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const placeholder = Nullable.Value(props.placeholder, undefined, (p) => useTranslatedText(p));

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

const ForwardedTextAreaField: React.ForwardRefRenderFunction<HTMLTextAreaElement, InputFieldProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const placeholder = Nullable.Value(props.placeholder, undefined, (p) => useTranslatedText(p));

	return (
		<textarea
			ref={ref}
			id={props.id}
			className={props.className ?? background.field}
			value={props.value}
			onBlur={() => props.onBlur && props.onBlur()}
			onChange={(evt) => { evt.target.style.height = `${evt.target.scrollHeight}px`; props.onChange(evt.currentTarget.value); }}
			autoFocus={true}
			disabled={props.disabled}
			style={ApplyLayoutStyleProps(props)}
			placeholder={placeholder}
		/>
	);
};

export const InputField = React.forwardRef(ForwardedInputField);
export const TextAreaField = React.forwardRef(ForwardedTextAreaField);
export const TextField = React.forwardRef(ForwardedTextField);
export const MultiLineField = React.forwardRef(ForwardedMultiLineField);
