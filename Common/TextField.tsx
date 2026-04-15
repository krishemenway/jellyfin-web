import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { useBackgroundStyles } from "AppStyles";
import { EditableField } from "Common/EditableField";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface TextFieldProps extends BaseInputFieldProps {
	field: EditableField;
	password?: boolean;
	multiLine?: boolean;
}

interface NumberFieldProps extends BaseInputFieldProps {
	field: EditableField<number|undefined|null>;
}

interface InputFieldProps extends BaseInputFieldProps {
	id: string;
	value: string;
	onChange: (newValue: string) => void;
}

interface BaseInputFieldProps extends LayoutWithoutChildrenProps {
	className?: string;
	type?: React.HTMLInputTypeAttribute;

	disabled?: boolean;

	placeholder?: TranslationRequest;

	onBlur?: () => void;
}

const ForwardedNumberField: React.ForwardRefRenderFunction<HTMLInputElement, NumberFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return <InputField {...props} id={props.field.FieldId} type="number" value={currentValue?.toString() ?? ""} onChange={(newValue) => props.field.OnChange(parseFloat(newValue))} ref={ref} />;
};

const ForwardedTextField: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return <InputField {...props} id={props.field.FieldId} type={props.password ? "password" : "text"} value={currentValue ?? ""} onChange={(newValue) => props.field.OnChange(newValue)} ref={ref} />;
};

const ForwardedMultiLineField: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return <TextAreaField {...props} id={props.field.FieldId} value={currentValue ?? ""} onChange={(newValue) => props.field.OnChange(newValue)} ref={ref} />;
};

const ForwardedInputField: React.ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const placeholder = Nullable.Value(props.placeholder, undefined, (p) => useTranslatedText(p));

	return (
		<input
			type={props.type}
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

export const NumberField = React.forwardRef(ForwardedNumberField);
export const InputField = React.forwardRef(ForwardedInputField);
export const TextAreaField = React.forwardRef(ForwardedTextAreaField);
export const TextField = React.forwardRef(ForwardedTextField);
export const MultiLineField = React.forwardRef(ForwardedMultiLineField);
